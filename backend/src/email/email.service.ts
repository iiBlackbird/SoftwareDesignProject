import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('SENDGRID_API_KEY not found');
    }
    sgMail.setApiKey(apiKey);
  }

  async send(mail: any) {
    this.logger.log(`Sending email to ${mail.to} with template ${mail.templateId}`);
    try {
      await sgMail.send(mail);
      this.logger.log(`Email sent successfully to ${mail.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${mail.to}`, error);
      throw new InternalServerErrorException('Failed to send verification email.');
    }
  }
}
