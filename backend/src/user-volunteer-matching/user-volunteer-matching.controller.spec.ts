import { UserVolunteerMatchingController } from './user-volunteer-matching.controller';
import { UserVolunteerMatchingService } from './user-volunteer-matching.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserVolunteerMatchingController', () => {
  let controller: UserVolunteerMatchingController;
  let service: UserVolunteerMatchingService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    //  create a mock Prisma service so constructor dependency works
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
    await controller.getMatchedEvents('123');
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

    const result = await controller.getMatchedEvents('123');
    expect(result).toEqual(mockMatches);
  });

  it('should call enrollInEvent from service', async () => {
    const spy = jest.spyOn(service, 'enrollInEvent').mockResolvedValue({ success: true });
    const body = { userId: '123', eventId: 'abc' };

    const result = await controller.enrollInEvent(body);
    expect(spy).toHaveBeenCalledWith('123', 'abc');
    expect(result).toEqual({ success: true });
  });
});
