import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import sgMail from '@sendgrid/mail';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));

describe('EmailService', () => {
  let service: EmailService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    mockConfigService.get.mockReturnValue('test-api-key'); // Set mock value before module compilation
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should set the SendGrid API key on initialization', () => {
      // The constructor is called during module compilation, so we just need to check the result
      expect(sgMail.setApiKey).toHaveBeenCalledWith('test-api-key');
    });

    it('should throw an error if SendGrid API key is not found', () => {
        mockConfigService.get.mockReturnValue(null);
        expect(() => new EmailService(configService)).toThrow(
            new InternalServerErrorException('SENDGRID_API_KEY not found'),
          );
    });
  });

  describe('send', () => {
    const mail = {
      to: 'test@example.com',
      templateId: 'd-12345',
    };

    beforeEach(() => {
      // Reset the mock before each test in this describe block
      (sgMail.send as jest.Mock).mockClear();
    });

    it('should send an email successfully', async () => {
      (sgMail.send as jest.Mock).mockResolvedValue(undefined);
      
      await service.send(mail);

      expect(sgMail.send).toHaveBeenCalledWith(mail);
    });

    it('should throw an error if sending email fails', async () => {
      (sgMail.send as jest.Mock).mockRejectedValue(new Error('Failed to send'));

      await expect(service.send(mail)).rejects.toThrow(
        new InternalServerErrorException('Failed to send verification email.'),
      );
    });
  });
});
