import { Test, TestingModule } from '@nestjs/testing';
import { StatesController } from './states.controller';
import { StatesService } from './states.service';
import { HttpStatus } from '@nestjs/common';

describe('StatesController', () => {
  let controller: StatesController;
  let service: StatesService;

  const mockStatesService = {
    getAllStates: jest.fn(),
    getStateById: jest.fn(),
    getStateByAbbreviation: jest.fn(),
    getRegions: jest.fn(),
    seedStates: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatesController],
      providers: [
        {
          provide: StatesService,
          useValue: mockStatesService,
        },
      ],
    }).compile();

    controller = module.get<StatesController>(StatesController);
    service = module.get<StatesService>(StatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllStates', () => {
    it('should return all states', async () => {
      const mockResult = {
        success: true,
        data: [
          {
            id: '1',
            name: 'California',
            abbreviation: 'CA',
            capital: 'Sacramento',
            region: 'West',
          },
        ],
        count: 1,
      };

      mockStatesService.getAllStates.mockResolvedValue(mockResult);

      const result = await controller.getAllStates({});

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult.data);
    });
  });

  describe('getRegions', () => {
    it('should return all regions', async () => {
      const mockResult = {
        success: true,
        data: [
          { name: 'West', stateCount: 13 },
          { name: 'South', stateCount: 16 },
        ],
      };

      mockStatesService.getRegions.mockResolvedValue(mockResult);

      const result = await controller.getRegions();

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult.data);
    });
  });
});