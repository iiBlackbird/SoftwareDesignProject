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
    const req = { user: undefined }; // simulate missing user
  
    await expect(controller.getUserHistory(req as any)).rejects.toThrow(BadRequestException);
    await expect(controller.getUserHistory(req as any)).rejects.toThrow('userId is required');
  });
  
  it('should call historyService.getUserHistory with correct userId', async () => {
    const req = { user: { id: 'user123' } }; // simulate authenticated user
  
    const mockResponse = [
      {
        id: '1',
        userId: 'user123',
        eventId: 'event1',
        event: { id: 'event1', name: 'Community Cleanup' },
      },
    ];
  
    mockUserVolunteerHistoryService.getUserHistory.mockResolvedValue(mockResponse);
  
    const result = await controller.getUserHistory(req as any);
  
    expect(service.getUserHistory).toHaveBeenCalledTimes(1);
    expect(service.getUserHistory).toHaveBeenCalledWith('user123');
    expect(result).toEqual(mockResponse);
  });

  it('should call historyService.getUserHistory using GetUserHistoryDto', async () => {
    const dto = new GetUserHistoryDto();
    dto.userId = 'user123';

    const req = { user: { id: dto.userId } } as any;

    const mockResponse = [
      {
        id: '1',
        userId: 'user123',
        eventId: 'event1',
        event: { id: 'event1', name: 'Community Cleanup' },
      },
    ];

    jest
      .spyOn(service, 'getUserHistory')
      .mockResolvedValue(mockResponse);

    const result = await controller.getUserHistory(req);
    
    expect(service.getUserHistory).toHaveBeenCalledWith(dto.userId);
    expect(result).toEqual(mockResponse);
  });

  

  it('should return an empty array if service returns no history', async () => {
    const req = { user: { id: 'emptyUser' } };    

    mockUserVolunteerHistoryService.getUserHistory.mockResolvedValue([]);

    const result = await controller.getUserHistory(req as any);

    expect(service.getUserHistory).toHaveBeenCalledWith('emptyUser');
    expect(result).toEqual([]);
  });

  it('should propagate errors thrown by the service', async () => {
    const req = { user: { id: 'errorUser' } };

    mockUserVolunteerHistoryService.getUserHistory.mockRejectedValue(
      new Error('Database failure'),
    );

    await expect(controller.getUserHistory(req as any)).rejects.toThrow('Database failure');
  });
});

