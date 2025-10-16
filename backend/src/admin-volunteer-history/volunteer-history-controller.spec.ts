import { Test, TestingModule } from '@nestjs/testing';
import { VolunteerHistoryController } from './volunteer-history.controller';
import { VolunteerHistoryService } from './volunteer-history.service';
import { volunteerHistory } from './mock-volunteer-history';

describe('VolunteerHistoryController', () => {
  let controller: VolunteerHistoryController;
  let service: VolunteerHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VolunteerHistoryController],
      providers: [VolunteerHistoryService],
    }).compile();

    controller = module.get<VolunteerHistoryController>(VolunteerHistoryController);
    service = module.get<VolunteerHistoryService>(VolunteerHistoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAll should return all volunteer history', () => {
    const result = controller.getAll();
    expect(result).toEqual(volunteerHistory);
  });

  it('getByVolunteer should return filtered history by volunteer name', () => {
    const name = 'John Smith';
    const result = controller.getByVolunteer(name);
    expect(result.every(r => r.volunteerName === name)).toBe(true);
  });

  it('getByVolunteer should be case-insensitive', () => {
    const name = 'john smith';
    const result = controller.getByVolunteer(name);
    expect(result.every(r => r.volunteerName.toLowerCase() === name)).toBe(true);
  });

  it('getByVolunteer should return empty array if no match', () => {
    const name = 'No Name';
    const result = controller.getByVolunteer(name);
    expect(result).toEqual([]);
  });
});
