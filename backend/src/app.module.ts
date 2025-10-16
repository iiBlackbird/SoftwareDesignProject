import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { VolunteerHistoryModule } from './admin-volunteer-history/volunteer-history.module';
import { UserVolunteerHistoryModule } from './user-volunteer-history/user-volunteer-history.module';
import { UserVolunteerMatchingModule } from './user-volunteer-matching/user-volunteer-matching.module';
import { AdminVolunteerMatchingModule } from './admin-volunteer-matching/admin-volunteer-matching.module';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '../.env', isGlobal: true }), AuthModule, VolunteerHistoryModule, UserVolunteerHistoryModule, UserVolunteerMatchingModule, AdminVolunteerMatchingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
