import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { UpsertUserProfileDto } from './dto/upsert-user-profile.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('UserProfileController', () => {
  let controller: UserProfileController;
  let service: UserProfileService;

  const mockService = {
    getUserProfile: jest.fn(),
    upsertUserProfile: jest.fn(),
  };

  const mockReq = (id?: string) => ({ user: id ? { id } : undefined });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProfileController],
      providers: [{ provide: UserProfileService, useValue: mockService }],
    }).compile();

    controller = module.get<UserProfileController>(UserProfileController);
    service = module.get<UserProfileService>(UserProfileService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getProfile', () => {
    it('throws BadRequestException if user not logged in', async () => {
      await expect(controller.getProfile(mockReq())).rejects.toThrow(
        BadRequestException,
      );
    });

    it('returns user profile if logged in', async () => {
      const userId = '123';
      const profile = { fullName: 'Alice' };
      mockService.getUserProfile.mockResolvedValue(profile);

      const result = await controller.getProfile(mockReq(userId));
      expect(result).toEqual(profile);
      expect(mockService.getUserProfile).toHaveBeenCalledWith(userId);
    });
  });

  describe('upsertProfile', () => {
    const validDto = plainToInstance(UpsertUserProfileDto, {
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

    it('throws BadRequestException if user not logged in', async () => {
      await expect(controller.upsertProfile(mockReq(), validDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('upserts profile when user logged in', async () => {
      const userId = '123';
      const expected = { ...validDto, userId };
      mockService.upsertUserProfile.mockResolvedValue(expected);

      const result = await controller.upsertProfile(mockReq(userId), validDto);
      expect(result).toEqual(expected);
      expect(mockService.upsertUserProfile).toHaveBeenCalledWith(userId, validDto);
    });

    it('fails if DTO is invalid', async () => {
      const invalidDto = plainToInstance(UpsertUserProfileDto, {
        fullName: '',
        address1: '',
        city: '',
        state: 'C',
        zip: '123',
        skills: [],
        availability: [],
      });

      const errors = await validate(invalidDto);
      expect(errors.length).toBeGreaterThan(0);
      const properties = errors.map(e => e.property);
      expect(properties).toEqual(
        expect.arrayContaining(['fullName', 'address1', 'city', 'state', 'zip', 'skills', 'availability'])
      );
    });
  });
});
