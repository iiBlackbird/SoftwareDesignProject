import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_SECRET') {
        return 'test-secret';
      }
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the user payload without the password', async () => {
      const user = { id: '1', email: 'test@example.com', password: 'password', emailVerified: true };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const { password, ...expectedResult } = user;
      const result = await strategy.validate({ sub: '1', email: 'test@example.com' });

      expect(result).toEqual(expectedResult);
    });

    it('should return null if user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await strategy.validate({ sub: '1', email: 'test@example.com' });

      expect(result).toBeNull();
    });

    it('should throw an UnauthorizedException if email is not verified', async () => {
      const user = { id: '1', email: 'test@example.com', password: 'password', emailVerified: false };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      await expect(strategy.validate({ sub: '1', email: 'test@example.com' })).rejects.toThrow(UnauthorizedException);
    });
  });
});
