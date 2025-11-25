import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { EventModule } from './event/event.module';
import { VolunteerHistoryModule } from './admin-volunteer-history/volunteer-history.module';
import { UserVolunteerHistoryModule } from './user-volunteer-history/user-volunteer-history.module';
import { UserVolunteerMatchingModule } from './user-volunteer-matching/user-volunteer-matching.module';
import { AdminVolunteerMatchingModule } from './admin-volunteer-matching/admin-volunteer-matching.module';
import { NotificationModule } from './notification/notification.module';
import { AdminEventsModule } from './admin-events/admin-events.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { ReportModule } from './admin-reports/report.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    EmailModule,
    EventModule,
    VolunteerHistoryModule,
    UserVolunteerHistoryModule,
    UserVolunteerMatchingModule,
    AdminVolunteerMatchingModule,
    NotificationModule,
    AdminEventsModule,
    UserProfileModule,
    ReportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
