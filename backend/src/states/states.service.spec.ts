import { Test, TestingModule } from '@nestjs/testing';
import { StatesService } from './states.service';
import { PrismaService } from '../prisma/prisma.service';

describe('StatesService', () => {
  let service: StatesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    state: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      groupBy: jest.fn(),
      count: jest.fn(),
      createMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StatesService>(StatesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllStates', () => {
    it('should return all states', async () => {
      const mockStates = [
        {
          id: '1',
          name: 'California',
          abbreviation: 'CA',
          capital: 'Sacramento',
          region: 'West',
        },
        {
          id: '2',
          name: 'Texas',
          abbreviation: 'TX',
          capital: 'Austin',
          region: 'South',
        },
      ];

      mockPrismaService.state.findMany.mockResolvedValue(mockStates);

      const result = await service.getAllStates();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockStates);
      expect(result.count).toBe(2);
    });
  });

  describe('getStateByAbbreviation', () => {
    it('should return state by abbreviation', async () => {
      const mockState = {
        id: '1',
        name: 'California',
        abbreviation: 'CA',
        capital: 'Sacramento',
        region: 'West',
      };

      mockPrismaService.state.findUnique.mockResolvedValue(mockState);

      const result = await service.getStateByAbbreviation('CA');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockState);
      expect(mockPrismaService.state.findUnique).toHaveBeenCalledWith({
        where: { abbreviation: 'CA' },
      });
    });
  });
});