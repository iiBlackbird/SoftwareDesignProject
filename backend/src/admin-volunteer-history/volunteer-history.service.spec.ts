import { Test, TestingModule } from '@nestjs/testing';
import { VolunteerHistoryService } from './volunteer-history.service';
import { volunteerHistory } from './mock-volunteer-history';

describe('VolunteerHistoryService', () => {
  let service: VolunteerHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VolunteerHistoryService],
    }).compile();

    service = module.get<VolunteerHistoryService>(VolunteerHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all volunteer history', () => {
    const result = service.findAll();
    expect(result).toEqual(volunteerHistory);
  });

  it('findByVolunteer should return filtered history by volunteer name', () => {
    const name = 'John Smith';
    const result = service.findByVolunteer(name);
    expect(result.every(r => r.volunteerName === name)).toBe(true);
  });

  it('findByVolunteer should be case-insensitive', () => {
    const name = 'john smith';
    const result = service.findByVolunteer(name);
    expect(result.every(r => r.volunteerName.toLowerCase() === name)).toBe(true);
  });

  it('findByVolunteer should return empty array if no match', () => {
    const name = 'No Name';
    const result = service.findByVolunteer(name);
    expect(result).toEqual([]);
  });
});
