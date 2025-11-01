import { Test, TestingModule } from '@nestjs/testing';
import { AdminEventsService } from './admin-events.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AdminEventsService', () => {
  let service: AdminEventsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminEventsService,
        {
          provide: PrismaService,
          useValue: {
            event: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AdminEventsService>(AdminEventsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUpcomingEvents', () => {
    it('should call prisma.event.findMany with correct params and return events', async () => {
      const mockEvents = [
        {
          id: '1',
          name: 'Event 1',
          description: 'Desc 1',
          location: 'Location 1',
          requiredSkills: ['skill1'],
          urgency: 'high',
          eventDate: new Date(),
        },
      ];

      (prisma.event.findMany as jest.Mock).mockResolvedValue(mockEvents);

      const result = await service.getUpcomingEvents();

      // Check prisma call
      expect(prisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            eventDate: expect.objectContaining({ gte: expect.any(Date) }),
          }),
          select: {
            id: true,
            name: true,
            description: true,
            location: true,
            requiredSkills: true,
            urgency: true,
            eventDate: true,
          },
          orderBy: { eventDate: 'asc' },
        }),
      );

      // Check return
      expect(result).toEqual(mockEvents);
    });
  });
});
