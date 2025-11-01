import { Test, TestingModule } from '@nestjs/testing';
import { VolunteerHistoryService } from './volunteer-history.service';
import { PrismaService } from '../prisma/prisma.service';

describe('VolunteerHistoryService', () => {
  let service: VolunteerHistoryService;
  let prisma: PrismaService;

  const mockPrisma = {
    volunteerHistory: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VolunteerHistoryService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<VolunteerHistoryService>(VolunteerHistoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return mapped volunteer history records', async () => {
      const mockRecords = [
        {
          id: '1',
          status: 'Attending',
          user: { fullName: 'John Smith' },
          event: {
            name: 'Blood Drive',
            description: 'First Aid Event',
            location: 'Red Cross',
            requiredSkills: ['First Aid'],
            urgency: 'Medium',
            eventDate: new Date('2025-10-10'),
          },
        },
      ];

      mockPrisma.volunteerHistory.findMany.mockResolvedValue(mockRecords);

      const result = await service.findAll();

      expect(mockPrisma.volunteerHistory.findMany).toHaveBeenCalledWith({
        include: { user: true, event: true },
      });

      expect(result).toEqual([
        {
          id: '1',
          volunteerName: 'John Smith',
          eventName: 'Blood Drive',
          eventDescription: 'First Aid Event',
          location: 'Red Cross',
          requiredSkills: ['First Aid'],
          urgency: 'Medium',
          eventDate: '2025-10-10',
          participationStatus: 'Attending',
        },
      ]);
    });
  });

  describe('findByVolunteer', () => {
    it('should query volunteer history by volunteer name (case-insensitive)', async () => {
      const name = 'John Smith';
      const mockRecords = [
        {
          id: '1',
          status: 'Attending',
          user: { fullName: 'John Smith' },
          event: {
            name: 'Blood Drive',
            description: 'First Aid Event',
            location: 'Red Cross',
            requiredSkills: ['First Aid'],
            urgency: 'Medium',
            eventDate: new Date('2025-10-10'),
          },
        },
      ];

      mockPrisma.volunteerHistory.findMany.mockResolvedValue(mockRecords);

      const result = await service.findByVolunteer(name);

      expect(mockPrisma.volunteerHistory.findMany).toHaveBeenCalledWith({
        where: {
          user: {
            fullName: {
              equals: name,
              mode: 'insensitive',
            },
          },
        },
        include: { user: true, event: true },
      });

      expect(result[0].volunteerName).toBe('John Smith');
      expect(result[0].eventName).toBe('Blood Drive');
    });

    it('should return an empty array if no matches found', async () => {
      mockPrisma.volunteerHistory.findMany.mockResolvedValue([]);
      const result = await service.findByVolunteer('No Name');
      expect(result).toEqual([]);
    });
  });
});
