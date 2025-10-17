import { availableMemory } from "process";
import { AdminVolunteerMatchingService } from "./admin-volunteer-matching.service";

describe('AdminVolunteerMatchingService', () => {
    let service: AdminVolunteerMatchingService;

    beforeEach(() => {
        service = new AdminVolunteerMatchingService();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should calculate match points correctly', () => {
        const user: any = {
            id: 1,
            name: 'John Smith',
            skills: ['First Aid', 'Teamwork'],
            availability: ['2025-10-20', '2025-10-22'],
            location: 'City Center',
        };

        const event: any = {
            eventId: 1,
            eventName: 'Blood Drive',
            requiredSkills: ['First Aid', 'Organization'],
            date: '2025-10-20',
            location: 'City Center',
            urgency: 'High',
        };

        const points = (service as any).calculateMatchPoints(user, event);
        expect(points).toBeGreaterThan(0);
    });

    it('should give fewer points when locations do not match', () => {
        const user: any = {
            id: 2,
            name: 'Alice',
            skills: ['Teamwork'],
            availability: ['2025-11-01'],
            location: 'Suburbs',
        };
        const event: any = {
            eventId: 3,
            eventName: 'City Cleanup',
            requiredSkills: ['Teamwork'],
            date: '2025-11-01',
            location: 'City Center',
            urgency: 'Low',
        };
      
        const points = (service as any).calculateMatchPoints(user, event);
        expect(points).toBeLessThan(10); 
    });

    it('should return suggested matches', () => {
        const matches = service.getSuggestedMatches();
    
        expect(matches.length).toBeGreaterThan(0);
        expect(matches[0]).toHaveProperty('volunteerId');
        expect(matches[0]).toHaveProperty('suggestedEvent');
    });

    it('should assign volunteer to event successfully', () => {
        const response = service.assignVolunteerToEvent(1, 1);

        expect(response.message).toBe('Volunteer assigned successfully.');
        expect(response.record).toMatchObject({
            userId: 1,
            eventId: 1,
            status: 'assigned',
        });
    });
    
    it('should update status if volunteer already assigned', () => {
        service.assignVolunteerToEvent(1, 1);
        const response = service.assignVolunteerToEvent(1, 1);

        expect(response.message).toBe('Volunteer already matched, status updated.');
        expect(response.record?.status).toBe('assigned');
    });

    it('should remove volunteer after assignment', () => {
        const initialCount = (service as any).users.length;
        service.assignVolunteerToEvent(1, 1);
        const afterCount = (service as any).users.length;

        expect(afterCount).toBeLessThan(initialCount);
    });

    it('should handle assignment when volunteer is not in the list', () => {
        const response = service.assignVolunteerToEvent(999, 1); 
        expect(response.message).toBe('Volunteer assigned successfully.');
      
        expect((service as any).volunteerHistory.some(vh => vh.userId === 999 && vh.eventId === 1)).toBe(true);
    });  

    it('should return "No suitable match" when maxPoints is 0', () => {
        const service = new AdminVolunteerMatchingService();
      
        (service as any).users = [{ id: 1, name: 'Alice', skills: [], availability: [], location: '' }];
        (service as any).events = [{ eventId: 1, eventName: 'Test', requiredSkills: [], date: '', location: '', urgency: 'Low' }];
      
        const matches = service.getSuggestedMatches();
        expect(matches[0].suggestedEvent).toBe('No suitable match');
        expect(matches[0].suggestedEventId).toBeNull();
    }); 
});