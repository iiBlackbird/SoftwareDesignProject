import { Test, TestingModule } from '@nestjs/testing';
import { AdminVolunteerMatchingController } from './admin-volunteer-matching.controller';
import { AdminVolunteerMatchingService } from './admin-volunteer-matching.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AdminVolunteerMatchingController', () => {
  let controller: AdminVolunteerMatchingController;
  let service: AdminVolunteerMatchingService;

  const mockMatchingService = {
    getSuggestedMatches: jest.fn(),
    getAllEvents: jest.fn(),
    assignVolunteerToEvent: jest.fn(),
  };

  const mockPrismaService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminVolunteerMatchingController],
      providers: [
        { provide: AdminVolunteerMatchingService, useValue: mockMatchingService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<AdminVolunteerMatchingController>(AdminVolunteerMatchingController);
    service = module.get<AdminVolunteerMatchingService>(AdminVolunteerMatchingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return suggested matches', async () => {
    const mockMatches = [
      {
        volunteerId: '1',
        volunteerName: 'John Smith',
        suggestedEvent: 'Beach Cleanup',
        suggestedEventId: '10',
      },
    ];

    mockMatchingService.getSuggestedMatches.mockResolvedValue(mockMatches);

    const result = await controller.getMatches();

    expect(service.getSuggestedMatches).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockMatches);
  });

  it('should return all events', async () => {
    const mockEvents = {
      events: [
        { id: '1', name: 'Tree Planting' },
        { id: '2', name: 'Food Drive' },
      ],
    };

    mockMatchingService.getAllEvents.mockResolvedValue(mockEvents);

    const result = await controller.getEvents();

    expect(service.getAllEvents).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockEvents);
  });

  it('should assign a volunteer to an event', async () => {
    const mockBody = { volunteerId: 'v1', eventId: 'e1' };
    const mockResponse = {
      message: 'Volunteer assigned successfully.',
      record: { id: '123', userId: 'v1', eventId: 'e1', status: 'assigned' },
    };

    mockMatchingService.assignVolunteerToEvent.mockResolvedValue(mockResponse);

    const result = await controller.assignVolunteer(mockBody);

    expect(service.assignVolunteerToEvent).toHaveBeenCalledTimes(1);
    expect(service.assignVolunteerToEvent).toHaveBeenCalledWith('v1', 'e1');
    expect(result).toEqual(mockResponse);
  });

  it('should propagate errors from the service', async () => {
    mockMatchingService.getSuggestedMatches.mockRejectedValue(
      new Error('Database connection failed'),
    );

    await expect(controller.getMatches()).rejects.toThrow('Database connection failed');
  });
});
