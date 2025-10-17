import { UserVolunteerMatchingService } from "./user-volunteer-matching.service";

describe('UserVolunteerMatchingService', () => {
    let service: UserVolunteerMatchingService;

    beforeEach(() => {
        service = new UserVolunteerMatchingService();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return matched events for user', () => {
        const matches = service.getUserMatches(1);
        expect(matches).toBeDefined;
        expect(matches.length).toBe(2);
        expect(matches[0]).toHaveProperty('eventName');
        expect(matches[0]).toHaveProperty('status');
    });

    it('should return an empty array for a user that does not exist', () => {
        const matches = service.getUserMatches(999);
        expect(matches).toEqual([]);
    });

    it('should return an empty array if user exists but has no matching events', () => {
        (service as any).users.push({
            id: 3,
            name: 'New User',
            skills: ['Organization'],
            location: 'Downtown',
        });

        const matches = service.getUserMatches(3);
        expect(matches).toEqual([]);
    });

    it('should include volunteer status in matched event', () => {
        const matches = service.getUserMatches(1);
        const enrolledEvent = matches.find((m) => m.status === 'enrolled');
        expect(enrolledEvent).toBeDefined();
    });

    it('should not include null events in result', () => {
        const originalEvents = (service as any).eventDetails;
        (service as any).eventDetails = [];

        const matches = service.getUserMatches(1);
        expect(matches).toEqual([]);

        (service as any).eventDetails = originalEvents;
    });
});