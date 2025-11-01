import { Test, TestingModule } from '@nestjs/testing';
import { AdminVolunteerMatchingService } from './admin-volunteer-matching.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AdminVolunteerMatchingService', () => {
    let service: AdminVolunteerMatchingService;
    let prisma: PrismaService;

    const mockEvents = [
        { id: '1', name: 'Event A', eventDate: '2025-10-20', requiredSkills: ['First Aid'], location: 'City Center', urgency: 'High' },
        { id: '2', name: 'Event B', eventDate: '2025-10-21', requiredSkills: ['Teamwork'], location: 'Suburbs', urgency: 'Medium' },
    ];

    const mockUsers = [
        { userId: 'u1', fullName: 'Alice', skills: ['First Aid'], availability: ['2025-10-20'], location: 'City Center' },
        { userId: 'u2', fullName: 'Bob', skills: ['Teamwork'], availability: ['2025-10-21'], location: 'Suburbs' },
    ];

    const mockVolunteerHistory = [
        { userId: 'u1', eventId: '2', status: 'assigned' },
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            AdminVolunteerMatchingService,
            {
            provide: PrismaService,
            useValue: {
                event: { findMany: jest.fn() },
                userProfile: { findMany: jest.fn() },
                volunteerHistory: { findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn() },
            },
            },
        ],
        }).compile();

        service = module.get<AdminVolunteerMatchingService>(AdminVolunteerMatchingService);
        prisma = module.get<PrismaService>(PrismaService);

        // Default mocks
        (prisma.event.findMany as jest.Mock).mockResolvedValue(mockEvents);
        (prisma.userProfile.findMany as jest.Mock).mockResolvedValue(mockUsers);
        (prisma.volunteerHistory.findMany as jest.Mock).mockResolvedValue(mockVolunteerHistory);
        (prisma.volunteerHistory.findFirst as jest.Mock).mockResolvedValue(null);
        (prisma.volunteerHistory.create as jest.Mock).mockImplementation(async ({ data }) => data);

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return all events from getAllEvents', async () => {
        const mockEventData = [
          { id: '10', name: 'Tree Planting', eventDate: new Date() },
          { id: '11', name: 'Beach Cleanup', eventDate: new Date() },
        ];
        (prisma.event.findMany as jest.Mock).mockResolvedValue(mockEventData);
      
        const result = await service.getAllEvents();
      
        expect(prisma.event.findMany).toHaveBeenCalledWith({
          where: { eventDate: { gte: expect.any(Date) } },
          select: { id: true, name: true },
        });
        expect(result).toEqual({ events: mockEventData });
    });

    it('should calculate match points correctly', () => {
        const user = mockUsers[0];
        const event = mockEvents[0];

        const points = (service as any).calculateMatchPoints(user, event);
        expect(points).toBeGreaterThan(0);
    });

    it('should get suggested matches correctly', async () => {
        const matches = await service.getSuggestedMatches();

        expect(prisma.event.findMany).toHaveBeenCalled();
        expect(prisma.userProfile.findMany).toHaveBeenCalled();
        expect(prisma.volunteerHistory.findMany).toHaveBeenCalled();
        expect(matches.length).toBe(mockUsers.length);
        expect(matches[0]).toHaveProperty('volunteerId');
        expect(matches[0]).toHaveProperty('suggestedEvent');
    });

    it('should skip users already assigned to an event', async () => {
        (prisma.volunteerHistory.findMany as jest.Mock).mockResolvedValue([
          { userId: 'u1', eventId: '1', status: 'assigned' },
        ]);
      
        const matches = await service.getSuggestedMatches();
        
        expect(matches.find(m => m.volunteerId === 'u1')?.suggestedEvent).toBeDefined();
      });
      

    it('should handle "No suitable match"', async () => {
        const mockUser = { 
          userId: 'u3', 
          fullName: 'Charlie', 
          skills: [], 
          availability: [], 
          city: '', 
          state: '', 
          zipcode: '' 
        };
      
        const mockEvent = { 
          id: '10', 
          name: 'Event X', 
          requiredSkills: [], 
          location: 'Some Place', // Not online/virtual
          eventDate: '2025-11-01', 
          urgency: 'Low' 
        };
      
        (prisma.userProfile.findMany as jest.Mock).mockResolvedValue([mockUser]);
        (prisma.event.findMany as jest.Mock).mockResolvedValue([mockEvent]);
      
        // Force points to 0 so it triggers "No suitable match"
        jest.spyOn(service as any, 'calculateMatchPoints').mockReturnValue(0);
      
        const matches = await service.getSuggestedMatches();
        expect(matches[0].suggestedEvent).toBe('No suitable match');
        expect(matches[0].suggestedEventId).toBeNull();
      });

    it('should assign volunteer to event successfully', async () => {
        const response = await service.assignVolunteerToEvent('u2', '1');
    
        expect(prisma.volunteerHistory.findFirst).toHaveBeenCalledWith({ where: { userId: 'u2', eventId: '1' } });
        expect(prisma.volunteerHistory.create).toHaveBeenCalled();
        expect(response.message).toBe('Volunteer assigned successfully.');
        expect(response.record).toMatchObject({ userId: 'u2', eventId: '1', status: 'Matched' });
    });
    

    it('should handle already assigned volunteer', async () => {
        (prisma.volunteerHistory.findFirst as jest.Mock).mockResolvedValue({
        userId: 'u2',
        eventId: '1',
        status: 'Matched', 
        });
    
        const response = await service.assignVolunteerToEvent('u2', '1');
    
        expect(response.message).toBe('Volunteer already matched, status updated.');
        expect(response.record).toMatchObject({ userId: 'u2', eventId: '1', status: 'Matched' }); // <- change here
    });
    

    it('should prioritize higher urgency when points tie', async () => {
        const user = { userId: 'u4', fullName: 'Diana', skills: ['Skill'], availability: ['2025-10-20'], location: 'City' };
        const eventHigh = { id: 'h1', name: 'High Urgency', requiredSkills: ['Skill'], location: 'City', eventDate: '2025-10-20', urgency: 'High' };
        const eventLow = { id: 'l1', name: 'Low Urgency', requiredSkills: ['Skill'], location: 'City', eventDate: '2025-10-20', urgency: 'Low' };

        (prisma.userProfile.findMany as jest.Mock).mockResolvedValue([user]);
        (prisma.event.findMany as jest.Mock).mockResolvedValue([eventLow, eventHigh]);
        jest.spyOn(service as any, 'calculateMatchPoints').mockReturnValue(10);

        const matches = await service.getSuggestedMatches();
        expect(matches[0].suggestedEvent).toBe('High Urgency');
    });

    it('should pick earlier date when points and urgency tie', async () => {
        const user = { userId: 'u5', fullName: 'Ethan', skills: ['Skill'], availability: ['2025-10-20'], location: 'City' };
        const event1 = { id: 'e1', name: 'Later Event', requiredSkills: ['Skill'], location: 'City', eventDate: '2025-10-22', urgency: 'High' };
        const event2 = { id: 'e2', name: 'Earlier Event', requiredSkills: ['Skill'], location: 'City', eventDate: '2025-10-20', urgency: 'High' };

        (prisma.userProfile.findMany as jest.Mock).mockResolvedValue([user]);
        (prisma.event.findMany as jest.Mock).mockResolvedValue([event1, event2]);
        jest.spyOn(service as any, 'calculateMatchPoints').mockReturnValue(10);

        const matches = await service.getSuggestedMatches();
        expect(matches[0].suggestedEvent).toBe('Earlier Event');
    });

    it('should give +2 points for online or virtual events', () => {
        const user = { availability: [], skills: [], city: '', state: '', zipcode: '' } as any;
        const event = { location: 'Online Conference', requiredSkills: [], eventDate: '2025-11-01', urgency: 'low' } as any;        
      
        const points = (service as any).calculateMatchPoints(user, event);
        expect(points).toBe(2);
    });
      
    it('should give +2 points for city+state match', () => {
        const user = { 
            availability: [], // no availability points
            skills: [],       // no skill points
            city: 'Chicago', 
            state: 'IL', 
            zipcode: '' 
        } as any;
          
        const event = { 
            location: 'Chicago, IL', 
            requiredSkills: [], 
            eventDate: '2025-11-01', // not in availability
            urgency: 'low'            // low urgency, no extra point
        } as any;

        const points = (service as any).calculateMatchPoints(user, event);
        expect(points).toBe(2);
    });
      
    it('should give +1 point for city or state match', () => {
        const user = { availability: [], skills: [], city: 'Chicago', state: 'IL', zipcode: '' } as any;
        const event = { location: 'Chicago, NY', requiredSkills: [], eventDate: '2025-11-01', urgency: 'low' } as any;
        
        const points = (service as any).calculateMatchPoints(user, event);
        expect(points).toBe(1); // only city or state match
        
    });
      
    it('should give +1 point for ZIP match', () => {
        const user = {
          availability: [], // no +3 points
          skills: [],       // no skill points
          city: 'NoCity',   // doesn't match
          state: 'NoState', // doesn't match
          zipcode: '12345'
        } as any;
      
        const event = {
          location: '12345 Main St', // only ZIP matches
          requiredSkills: [],
          eventDate: '2025-12-01',   // doesn't match any availability
          urgency: 'low'             // no urgency points
        } as any;
      
        const points = (service as any).calculateMatchPoints(user, event);
        expect(points).toBe(1);
    });
});
