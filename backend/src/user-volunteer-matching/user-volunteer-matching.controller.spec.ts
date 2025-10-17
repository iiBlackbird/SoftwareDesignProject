import { UserVolunteerMatchingController } from "./user-volunteer-matching.controller";
import { UserVolunteerMatchingService } from "./user-volunteer-matching.service";

describe('UserVolunteerMatchingController', () => {
    let controller: UserVolunteerMatchingController;
    let service: UserVolunteerMatchingService;

    beforeEach(() => {
        service = new UserVolunteerMatchingService();
        controller = new UserVolunteerMatchingController(service);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call getUserMatches from service', () => {
        const spy = jest.spyOn(service, 'getUserMatches');
        controller.getUserMatches({} as any);
        expect(spy).toHaveBeenCalledWith(1);
    });

    it('should return user matches from service', () => {
        const mockMatches = [
            {
              eventId: 1,
              eventName: 'Mock Event',
              description: 'Mock description',
              location: 'Mock location',
              requiredSkills: ['Skill A'],
              urgency: 'High',
              eventDate: '2025-10-20',
              status: 'assigned',
            },
        ];
        jest.spyOn(service, 'getUserMatches').mockReturnValue(mockMatches);
    
        const result = controller.getUserMatches({} as any);
        expect(result).toEqual(mockMatches);
    });
})