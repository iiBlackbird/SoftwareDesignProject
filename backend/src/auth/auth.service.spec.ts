import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';

// Mock the bcrypt module
jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  compare: jest.fn(),
}));

// Mock the PrismaService
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

// Mock the JwtService
const mockJwtService = {
  sign: jest.fn(),
};

// Mock the EmailService
const mockEmailService = {
  send: jest.fn(),
};

// Mock the ConfigService
const mockConfigService = {
  get: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'SENDGRID_VERIFICATION_TEMPLATE_ID') {
        return 'd-12345';
      }
      return null;
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: EmailService, useValue: mockEmailService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a user with a verification token', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({ id: '1', email: 'test@example.com' });

      const result = await service.signUp('Test User', 'test@example.com', 'password');

      expect(result).toEqual({ message: 'User successfully registered. Please check your email to verify your account.' });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          email: 'test@example.com',
          fullName: 'Test User',
          verificationToken: expect.any(String),
          emailVerificationTokenExpires: expect.any(Date),
        }),
      }));
    });

    it('should throw a ConflictException if the user already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', email: 'test@example.com' });

      await expect(service.signUp('Test User', 'test@example.com', 'password')).rejects.toThrow(ConflictException);
    });
  });

  describe('verifyEmail', () => {
    it('should verify a user with a valid token', async () => {
      const user = { id: '1', emailVerificationTokenExpires: new Date(Date.now() + 3600000) };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.verifyEmail('valid-token');

      expect(result).toEqual({ message: 'Email successfully verified.' });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: {
          emailVerified: true,
          verificationToken: null,
          emailVerificationTokenExpires: null,
        },
      });
    });

    it('should throw a BadRequestException with an invalid token', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.verifyEmail('invalid-token')).rejects.toThrow(BadRequestException);
    });

    it('should throw a BadRequestException with an expired token', async () => {
      const user = { id: '1', emailVerificationTokenExpires: new Date(Date.now() - 1000) };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      await expect(service.verifyEmail('expired-token')).rejects.toThrow(BadRequestException);
    });
  });

  describe('signIn', () => {
    it('should return an access token for a verified user', async () => {
      const user = { id: '1', email: 'test@example.com', password: 'hashedPassword', emailVerified: true, fullName: 'Test User' };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('access-token');

      const result = await service.signIn('test@example.com', 'password');

      expect(result).toEqual({ accessToken: 'access-token' });
    });

    it('should throw an UnauthorizedException for an unverified user', async () => {
      const user = { id: '1', email: 'test@example.com', password: 'hashedPassword', emailVerified: false };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.signIn('test@example.com', 'password')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an UnauthorizedException for invalid credentials', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.signIn('test@example.com', 'password')).rejects.toThrow(UnauthorizedException);
    });
  });
});