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

    it('should select event with higher urgency when points tie', () => {
        const user: any = {
          id: 5,
          name: 'Diana',
          skills: ['First Aid'],
          availability: ['2025-10-20', '2025-10-21'],
          location: 'City Center',
        };
      
        const event1: any = {
          eventId: 1,
          eventName: 'Event A',
          requiredSkills: ['First Aid'],
          date: '2025-10-20',
          location: 'City Center',
          urgency: 'Medium',
        };
      
        const event2: any = {
          eventId: 2,
          eventName: 'Event B',
          requiredSkills: ['First Aid'],
          date: '2025-10-21',
          location: 'City Center',
          urgency: 'High', 
        };
      
        (service as any).users = [user];
        (service as any).events = [event1, event2];
      
        const matches = service.getSuggestedMatches();
        expect(matches[0].suggestedEvent).toBe('Event B'); 
    });

    it('should select event with earlier date when points and urgency tie', () => {
        const user: any = {
          id: 6,
          name: 'Ethan',
          skills: ['First Aid'],
          availability: ['2025-10-20', '2025-10-21'],
          location: 'City Center',
        };
      
        const event1: any = {
          eventId: 3,
          eventName: 'Event C',
          requiredSkills: ['First Aid'],
          date: '2025-10-22', 
          location: 'City Center',
          urgency: 'High',
        };
      
        const event2: any = {
          eventId: 4,
          eventName: 'Event D',
          requiredSkills: ['First Aid'],
          date: '2025-10-20', 
          location: 'City Center',
          urgency: 'High',
        };
      
        (service as any).users = [user];
        (service as any).events = [event1, event2];
      
        const matches = service.getSuggestedMatches();
        expect(matches[0].suggestedEvent).toBe('Event D'); 
    }); 

    it('should keep current bestMatch when points tie, urgency tie, but current event has later date', () => {
        const user: any = {
            id: 13,
            name: 'Later Date Test',
            skills: ['First Aid'],
            availability: ['2025-10-20', '2025-10-22'],
            location: 'City Center',
        };
    
        const event1: any = {
            eventId: 10,
            eventName: 'Event Earlier',
            requiredSkills: ['First Aid'],
            date: '2025-10-20', // earlier date - should be selected first
            location: 'City Center',
            urgency: 'High',
        };
    
        const event2: any = {
            eventId: 11,
            eventName: 'Event Later',
            requiredSkills: ['First Aid'],
            date: '2025-10-22', // later date - should not replace event1
            location: 'City Center',
            urgency: 'High', // same urgency
        };
    
        (service as any).users = [user];
        (service as any).events = [event1, event2];
    
        const matches = service.getSuggestedMatches();
        
        // event1 should win because it has the earlier date
        expect(matches[0].suggestedEvent).toBe('Event Earlier');
    });

    it('should replace bestMatch when urgency ties but event has earlier date', () => {
        const user: any = {
            id: 21,
            name: 'Earlier Date Tie Test',
            skills: ['Cooking'],
            availability: ['2025-11-10', '2025-11-15'],
            location: 'Community Center',
        };
    
        const event1: any = {
            eventId: 23,
            eventName: 'Later Date Event',
            requiredSkills: ['Cooking'],
            date: '2025-11-15',
            location: 'Community Center',
            urgency: 'Medium',
        };
    
        const event2: any = {
            eventId: 24,
            eventName: 'Earlier Date Event',
            requiredSkills: ['Cooking'],
            date: '2025-11-10', // earlier date, same urgency
            location: 'Community Center',
            urgency: 'Medium',
        };
    
        (service as any).users = [user];
        (service as any).events = [event1, event2];
    
        const matches = service.getSuggestedMatches();
        expect(matches[0].suggestedEvent).toBe('Earlier Date Event'); // must replace
    });

    it('should replace bestMatch when urgency is higher but points are equal', () => {
        const service = new AdminVolunteerMatchingService();
      
        const user: any = { id: 1, name: 'Tester' };
      
        const eventMedium: any = {
          eventId: 10,
          eventName: 'Medium Urgency Event',
          urgency: 'Medium',
        };
      
        const eventHigh: any = {
          eventId: 11,
          eventName: 'High Urgency Event',
          urgency: 'High',
        };
      
        // simulate equal scoring
        (service as any).users = [user];
        (service as any).events = [eventMedium, eventHigh];
      
        // mock scoring so both events have equal points
        jest.spyOn(service as any, 'calculateMatchPoints').mockReturnValue(10);
      
        // run matching
        const matches = service.getSuggestedMatches();
      
        // should choose the high urgency one
        expect(matches[0].suggestedEvent).toBe('High Urgency Event');
      });
});