import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// Mock the AuthService
const mockAuthService = {
  signUp: jest.fn(),
  signIn: jest.fn(),
  verifyEmail: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('verifyEmail', () => {
    it('should call authService.verifyEmail with the provided token', async () => {
      const token = 'test-token';
      await controller.verifyEmail(token);
      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(token);
    });
  });
});
