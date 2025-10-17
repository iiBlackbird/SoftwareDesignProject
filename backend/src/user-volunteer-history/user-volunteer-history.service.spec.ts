import { Test, TestingModule } from '@nestjs/testing';
import { UserVolunteerHistoryService } from './user-volunteer-history.service';

describe('UserVolunteerHistoryService', () => {
  let service: UserVolunteerHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserVolunteerHistoryService],
    }).compile();

    service = module.get<UserVolunteerHistoryService>(UserVolunteerHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return history for user with ID 1', () => {
    const history = service.getUserHistory(1);
    expect(history).toHaveLength(1);
    expect(history[0].userId).toBe(1);
    expect(history[0].eventName).toBe('Meal Kit Assembly');
  });

  it('should return empty array for user with no history', () => {
    const history = service.getUserHistory(999);
    expect(history).toEqual([]);
  });
});
