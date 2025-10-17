import { Test, TestingModule } from '@nestjs/testing';
import { UserVolunteerHistoryController } from './user-volunteer-history.controller';
import { UserVolunteerHistoryService } from './user-volunteer-history.service';

describe('UserVolunteerHistoryController', () => {
  let controller: UserVolunteerHistoryController;
  let service: UserVolunteerHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserVolunteerHistoryController],
      providers: [UserVolunteerHistoryService],
    }).compile();

    controller = module.get<UserVolunteerHistoryController>(UserVolunteerHistoryController);
    service = module.get<UserVolunteerHistoryService>(UserVolunteerHistoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user history', () => {
    const mockHistory = [
      {
        id: 1,
        eventName: 'Meal Kit Assembly',
        eventDescription:
          'Volunteers assemble pre-portioned ingredients and recipes into meal kits',
        location: 'School',
        requiredSkills: ['Cooking'],
        urgency: 'High',
        eventDate: '2025-11-15',
        participationStatus: 'Attending',
        userId: 1,
      },
    ];

    const serviceSpy = jest.spyOn(service, 'getUserHistory').mockReturnValue(mockHistory);

    const req = {} as any; // The controller hardcodes userId = 1
    const result = controller.getUserHistory(req);

    expect(serviceSpy).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockHistory);
  });
});
