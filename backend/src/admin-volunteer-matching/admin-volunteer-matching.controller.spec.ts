import { AdminVolunteerMatchingController } from './admin-volunteer-matching.controller';
import { AdminVolunteerMatchingService } from './admin-volunteer-matching.service';

describe('AdminVolunteerMatchingController', () => {
    let controller: AdminVolunteerMatchingController;
    let service: AdminVolunteerMatchingService;

    beforeEach(() => {
        service = new AdminVolunteerMatchingService();
        controller = new AdminVolunteerMatchingController(service);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return suggested matches', () => {
        const mockMatches = [
            {
                volunteerId: 1,
                volunteerName: 'John Smith',
                suggestedEvent: 'Blood Drive',
                suggestedEventId: 1,
            },
        ];

        jest.spyOn(service, 'getSuggestedMatches').mockReturnValue(mockMatches);

        const result = controller.getMatches();
        expect(result).toEqual(mockMatches);
    });

    it('should assign volunteer to event', () => {
        const mockResponse = {
            message: 'Volunteer assigned successfully.',
            ecord: { id: 1, userId: 1, eventId: 1, status: 'assigned' },
        };

        jest
            .spyOn(service, 'assignVolunteerToEvent')
            .mockReturnValue(mockResponse);

        const result = controller.assignVolunteer({ volunteerId: 1, eventId: 1 });
        expect(result).toEqual(mockResponse);
        expect(service.assignVolunteerToEvent).toHaveBeenCalledWith(1, 1);
    });
});
