import { UserVolunteerMatchingService } from './user-volunteer-matching.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserVolunteerMatchingService', () => {
  let service: UserVolunteerMatchingService;
  let prisma: PrismaService & { volunteerHistory: any };

  beforeEach(() => {
    prisma = {
      volunteerHistory: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    } as any;

    service = new UserVolunteerMatchingService(prisma);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMatchedEventsForUser', () => {
    it('should return formatted matched events', async () => {
      const mockRecord = [
        {
          id: 1,
          status: 'Matched',
          event: {
            id: 'e1',
            name: 'Beach Cleanup',
            description: 'Cleaning event',
            location: 'Santa Monica',
            requiredSkills: ['Teamwork'],
            urgency: 'High',
            eventDate: new Date('2025-10-20'),
          },
        },
      ];

      (prisma.volunteerHistory.findMany as jest.Mock).mockResolvedValue(mockRecord);

      const result = await service.getMatchedEventsForUser('u1');

      expect(prisma.volunteerHistory.findMany).toHaveBeenCalledWith({
        where: { userId: 'u1', status: 'Matched' },
        include: { event: true },
      });
      expect(result).toEqual([
        {
          id: 1,
          eventId: 'e1',
          eventName: 'Beach Cleanup',
          description: 'Cleaning event',
          location: 'Santa Monica',
          requiredSkills: ['Teamwork'],
          urgency: 'High',
          eventDate: '2025-10-20',
          status: 'Matched',
        },
      ]);
    });

    it('should return an empty array if no matches found', async () => {
      (prisma.volunteerHistory.findMany as jest.Mock).mockResolvedValue([]);
      const result = await service.getMatchedEventsForUser('u2');
      expect(result).toEqual([]);
    });
  });

  describe('enrollInEvent', () => {
    it('should update a matched record to Enrolled', async () => {
      const mockRecord = { id: 1, userId: 'u1', eventId: 'e1', status: 'Matched' };
      (prisma.volunteerHistory.findFirst as jest.Mock).mockResolvedValue(mockRecord);
      (prisma.volunteerHistory.update as jest.Mock).mockResolvedValue({
        ...mockRecord,
        status: 'Enrolled',
      });

      const result = await service.enrollInEvent('u1', 'e1');

      expect(prisma.volunteerHistory.findFirst).toHaveBeenCalledWith({
        where: { userId: 'u1', eventId: 'e1', status: 'Matched' },
      });
      expect(prisma.volunteerHistory.update).toHaveBeenCalledWith({
        where: { id: mockRecord.id },
        data: { status: 'Enrolled' },
      });
      expect(result.status).toBe('Enrolled');
    });

    it('should throw if no matched record exists', async () => {
      (prisma.volunteerHistory.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.enrollInEvent('u1', 'eX')).rejects.toThrow(
        'No matched record found for this event and user',
      );
    });
  });
});
