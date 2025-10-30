import { UserVolunteerMatchingController } from './user-volunteer-matching.controller';
import { UserVolunteerMatchingService } from './user-volunteer-matching.service';
import { PrismaService } from '../prisma/prisma.service';
import { GetUserMatchesDto } from './dto/get-user-matches.dto';

describe('UserVolunteerMatchingController', () => {
  let controller: UserVolunteerMatchingController;
  let service: UserVolunteerMatchingService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    // mock Prisma service
    prisma = {
      volunteerHistory: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    } as any;

    service = new UserVolunteerMatchingService(prisma);
    controller = new UserVolunteerMatchingController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getMatchedEventsForUser from service', async () => {
    const spy = jest.spyOn(service, 'getMatchedEventsForUser').mockResolvedValue([]);
    const mockReq = { user: { id: '123' } } as any;
    await controller.getMatchedEvents(mockReq);
    expect(spy).toHaveBeenCalledWith('123');
  });

  it('should return matched events from service', async () => {
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
    jest.spyOn(service, 'getMatchedEventsForUser').mockResolvedValue(mockMatches);

    const mockReq = { user: { id: '123' } } as any;
    const result = await controller.getMatchedEvents(mockReq);
    expect(result).toEqual(mockMatches);
  });

  it('should call enrollInEvent from service', async () => {
    const spy = jest.spyOn(service, 'enrollInEvent').mockResolvedValue({ success: true });
    const mockReq = { user: { id: '123' } } as any;
    const body = { eventId: 'abc' };

    const result = await controller.enrollInEvent(mockReq, body);
    expect(spy).toHaveBeenCalledWith('123', 'abc');
    expect(result).toEqual({ success: true });
  });

  it('should call getMatchedEventsForUser using GetUserMatchesDto', async () => {
    const dto = new GetUserMatchesDto();
    dto.userId = '123'; 
  
    const spy = jest
      .spyOn(service, 'getMatchedEventsForUser')
      .mockResolvedValue([]);

    const mockReq = { user: { id: dto.userId } } as any;
    await controller.getMatchedEvents(mockReq);
  
    expect(spy).toHaveBeenCalledWith(dto.userId);
  });
});
