import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { VolunteerHistoryModule } from './admin-volunteer-history/volunteer-history.module';
import { UserVolunteerHistoryModule } from './user-volunteer-history/user-volunteer-history.module';
import { UserVolunteerMatchingModule } from './user-volunteer-matching/user-volunteer-matching.module';
import { AdminVolunteerMatchingModule } from './admin-volunteer-matching/admin-volunteer-matching.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '../.env', isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'enmtcugse45a2tnu@ethereal.email',
          pass: '8PaqFHxWraR81uS41E',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    AuthModule,
    EventModule,
    VolunteerHistoryModule,
    UserVolunteerHistoryModule,
    UserVolunteerMatchingModule,
    AdminVolunteerMatchingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
