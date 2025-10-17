import { Module } from '@nestjs/common';
import { UserVolunteerMatchingController } from './user-volunteer-matching.controller';
import { UserVolunteerMatchingService } from './user-volunteer-matching.service';

@Module({
    controllers: [UserVolunteerMatchingController],
    providers: [UserVolunteerMatchingService],
    })
export class UserVolunteerMatchingModule {}