import { Module } from '@nestjs/common';
import { UserVolunteerHistoryService } from './user-volunteer-history.service';
import { UserVolunteerHistoryController } from './user-volunteer-history.controller';

@Module({
    controllers: [UserVolunteerHistoryController],
    providers: [UserVolunteerHistoryService],
})
export class UserVolunteerHistoryModule {}