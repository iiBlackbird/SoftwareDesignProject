import { Test, TestingModule } from '@nestjs/testing';
import { UserVolunteerHistoryController } from './user-volunteer-history.controller';
import { UserVolunteerHistoryService } from './user-volunteer-history.service';
import { BadRequestException } from '@nestjs/common';
import { GetUserHistoryDto } from './dto/get-user-history.dto';

describe('UserVolunteerHistoryController', () => {
  let controller: UserVolunteerHistoryController;
  let service: UserVolunteerHistoryService;

  const mockUserVolunteerHistoryService = {
    getUserHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserVolunteerHistoryController],
      providers: [
        { provide: UserVolunteerHistoryService, useValue: mockUserVolunteerHistoryService },
      ],
    }).compile();

    controller = module.get<UserVolunteerHistoryController>(UserVolunteerHistoryController);
    service = module.get<UserVolunteerHistoryService>(UserVolunteerHistoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw BadRequestException if userId is missing', async () => {
    const query = new GetUserHistoryDto();
    query.userId = undefined as any;

    await expect(controller.getUserHistory(query)).rejects.toThrow(BadRequestException);
    await expect(controller.getUserHistory(query)).rejects.toThrow('userId is required');
  });

  it('should call historyService.getUserHistory with correct userId', async () => {
    const query = new GetUserHistoryDto();
    query.userId = 'user123';

    const mockResponse = [
      {
        id: '1',
        userId: 'user123',
        eventId: 'event1',
        event: { id: 'event1', name: 'Community Cleanup' },
      },
    ];

    mockUserVolunteerHistoryService.getUserHistory.mockResolvedValue(mockResponse);

    const result = await controller.getUserHistory(query);

    expect(service.getUserHistory).toHaveBeenCalledTimes(1);
    expect(service.getUserHistory).toHaveBeenCalledWith('user123');
    expect(result).toEqual(mockResponse);
  });

  it('should return an empty array if service returns no history', async () => {
    const query = new GetUserHistoryDto();
    query.userId = 'emptyUser';

    mockUserVolunteerHistoryService.getUserHistory.mockResolvedValue([]);

    const result = await controller.getUserHistory(query);

    expect(service.getUserHistory).toHaveBeenCalledWith('emptyUser');
    expect(result).toEqual([]);
  });

  it('should propagate errors thrown by the service', async () => {
    const query = new GetUserHistoryDto();
    query.userId = 'errorUser';

    mockUserVolunteerHistoryService.getUserHistory.mockRejectedValue(
      new Error('Database failure'),
    );

    await expect(controller.getUserHistory(query)).rejects.toThrow('Database failure');
  });
});

