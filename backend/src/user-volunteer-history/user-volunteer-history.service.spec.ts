import { Test, TestingModule } from '@nestjs/testing';
import { UserVolunteerHistoryService } from './user-volunteer-history.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserVolunteerHistoryService', () => {
  let service: UserVolunteerHistoryService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    volunteerHistory: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserVolunteerHistoryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserVolunteerHistoryService>(UserVolunteerHistoryService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call prisma.volunteerHistory.findMany with correct parameters', async () => {
    const userId = 'user123';
    const mockResponse = [
      {
        id: '1',
        userId: 'user123',
        eventId: 'event1',
        status: 'completed',
        event: { id: 'event1', name: 'Beach Cleanup' },
      },
    ];

    mockPrismaService.volunteerHistory.findMany.mockResolvedValue(mockResponse);

    const result = await service.getUserHistory(userId);

    expect(prismaService.volunteerHistory.findMany).toHaveBeenCalledTimes(1);
    expect(prismaService.volunteerHistory.findMany).toHaveBeenCalledWith({
      where: { userId },
      include: { event: true },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should return an empty array if no history is found', async () => {
    const userId = 'nonexistentUser';
    mockPrismaService.volunteerHistory.findMany.mockResolvedValue([]);

    const result = await service.getUserHistory(userId);

    expect(prismaService.volunteerHistory.findMany).toHaveBeenCalledWith({
      where: { userId },
      include: { event: true },
    });
    expect(result).toEqual([]);
  });

  it('should throw an error if prisma throws an error', async () => {
    const userId = 'errorUser';
    mockPrismaService.volunteerHistory.findMany.mockRejectedValue(
      new Error('Database error'),
    );

    await expect(service.getUserHistory(userId)).rejects.toThrow('Database error');
  });
});
