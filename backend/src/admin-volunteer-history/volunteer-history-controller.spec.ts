import { Test, TestingModule } from '@nestjs/testing';
import { VolunteerHistoryController } from './volunteer-history.controller';
import { VolunteerHistoryService } from './volunteer-history.service';
import { GetVolunteerHistoryDto } from './dto/get-volunteer-history.dto';

describe('VolunteerHistoryController', () => {
  let controller: VolunteerHistoryController;
  let service: VolunteerHistoryService;

  const mockVolunteerHistoryService = {
    findAll: jest.fn().mockResolvedValue([
      {
        id: '1',
        volunteerName: 'John Smith',
        eventName: 'Beach Cleanup',
        status: 'Completed',
      },
      {
        id: '2',
        volunteerName: 'Jane Doe',
        eventName: 'Food Drive',
        status: 'Pending',
      },
    ]),
    findByVolunteer: jest.fn((name: string) => {
      const all = [
        {
          id: '1',
          volunteerName: 'John Smith',
          eventName: 'Beach Cleanup',
          status: 'Completed',
        },
        {
          id: '2',
          volunteerName: 'Jane Doe',
          eventName: 'Food Drive',
          status: 'Pending',
        },
      ];
      return Promise.resolve(
        all.filter((v) => v.volunteerName.toLowerCase() === name.toLowerCase())
      );
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VolunteerHistoryController],
      providers: [
        {
          provide: VolunteerHistoryService,
          useValue: mockVolunteerHistoryService,
        },
      ],
    }).compile();

    controller = module.get<VolunteerHistoryController>(VolunteerHistoryController);
    service = module.get<VolunteerHistoryService>(VolunteerHistoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAll should return all volunteer history', async () => {
    const result = await controller.getAll();
    expect(result).toEqual(await service.findAll());
    expect(service.findAll).toHaveBeenCalled();
  });

  it('getByVolunteer should return filtered history by volunteer name', async () => {
    const name = 'John Smith';
    const result = await controller.getByVolunteer(name);
    expect(result.every((r) => r.volunteerName === name)).toBe(true);
    expect(service.findByVolunteer).toHaveBeenCalledWith(name);
  });

  it('getByVolunteer should be case-insensitive', async () => {
    const name = 'john smith';
    const result = await controller.getByVolunteer(name);
    expect(result.every((r) => r.volunteerName.toLowerCase() === name)).toBe(true);
  });

  it('getByVolunteer should return empty array if no match', async () => {
    const name = 'No Name';
    const result = await controller.getByVolunteer(name);
    expect(result).toEqual([]);
  });

  it('getByVolunteer should use GetVolunteerHistoryDto', async () => {
    const dto = new GetVolunteerHistoryDto();
    dto.name = 'John Smith'; 
  
    const result = await controller.getByVolunteer(dto.name);
  
    expect(result.every((r) => r.volunteerName === dto.name)).toBe(true);
    expect(service.findByVolunteer).toHaveBeenCalledWith(dto.name);
  });
});
