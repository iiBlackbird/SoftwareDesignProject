import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileService } from './user-profile.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertUserProfileDto } from './dto/upsert-user-profile.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('UserProfileService', () => {
  let service: UserProfileService;
  let prisma: PrismaService;

  const mockPrisma = {
    userProfile: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProfileService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UserProfileService>(UserProfileService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('fetches user profile', async () => {
    const userId = '123';
    const expected = { userId, fullName: 'Alice' };
    mockPrisma.userProfile.findUnique.mockResolvedValue(expected);

    const result = await service.getUserProfile(userId);
    expect(result).toEqual(expected);
    expect(mockPrisma.userProfile.findUnique).toHaveBeenCalledWith({ where: { userId } });
  });

  it('upserts user profile with valid DTO', async () => {
    const dto = plainToInstance(UpsertUserProfileDto, {
      fullName: 'Alice',
      address1: '123 St',
      address2: 'Apt 4',
      city: 'Cityville',
      state: 'CA',
      zip: '12345',
      skills: ['skill1'],
      preferences: 'pref',
      availability: ['2025-10-31'],
    });

    // Validate DTO first
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    const expected = { ...dto, userId: '123' };
    mockPrisma.userProfile.upsert.mockResolvedValue(expected);

    const result = await service.upsertUserProfile('123', dto);
    expect(result).toEqual(expected);
    expect(mockPrisma.userProfile.upsert).toHaveBeenCalledWith({
      where: { userId: '123' },
      update: {
        fullName: 'Alice',
        address1: '123 St',
        address2: 'Apt 4',
        city: 'Cityville',
        state: 'CA',
        zipcode: '12345',
        skills: ['skill1'],
        preferences: 'pref',
        availability: [new Date('2025-10-31')],
      },
      create: {
        userId: '123',
        fullName: 'Alice',
        address1: '123 St',
        address2: 'Apt 4',
        city: 'Cityville',
        state: 'CA',
        zipcode: '12345',
        skills: ['skill1'],
        preferences: 'pref',
        availability: [new Date('2025-10-31')],
      },
    });
  });
});
