import { Test, TestingModule } from '@nestjs/testing';
import { AdminVolunteerMatchingController } from './admin-volunteer-matching.controller';
import { AdminVolunteerMatchingService } from './admin-volunteer-matching.service';
import { PrismaService } from '../prisma/prisma.service';
import { SuggestedMatchDto } from './dto/suggested-match.dto';
import { AssignVolunteerResponseDto } from './dto/assign-volunteer-response.dto';
import { AssignVolunteerDto } from './dto/assign-volunteer.dto';

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
    const dto = new SuggestedMatchDto();
    dto.volunteerId = '1';
    dto.volunteerName = 'John Smith';
    dto.suggestedEvent = 'Beach Cleanup';
    dto.suggestedEventId = '10';

    const mockMatches = [dto];
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

  it('should assign a volunteer to an event using DTOs', async () => {
    const assignDto = new AssignVolunteerDto();
    assignDto.volunteerId = 'v1';
    assignDto.eventId = 'e1';

    const responseDto = new AssignVolunteerResponseDto();
    responseDto.message = 'Volunteer assigned successfully.';
    responseDto.record = { id: '123', userId: 'v1', eventId: 'e1', status: 'assigned' };

    mockMatchingService.assignVolunteerToEvent.mockResolvedValue(responseDto);

    const result = await controller.assignVolunteer(assignDto);

    expect(service.assignVolunteerToEvent).toHaveBeenCalledTimes(1);
    expect(service.assignVolunteerToEvent).toHaveBeenCalledWith('v1', 'e1');
    expect(result).toEqual(responseDto);
  });

  it('should propagate errors from the service', async () => {
    mockMatchingService.getSuggestedMatches.mockRejectedValue(
      new Error('Database connection failed'),
    );

    await expect(controller.getMatches()).rejects.toThrow('Database connection failed');
  });
});


