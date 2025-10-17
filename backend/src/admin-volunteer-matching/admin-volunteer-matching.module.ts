import { Module } from '@nestjs/common';
import { AdminVolunteerMatchingService } from './admin-volunteer-matching.service';
import { AdminVolunteerMatchingController } from './admin-volunteer-matching.controller';

@Module({
    controllers: [AdminVolunteerMatchingController],
    providers: [AdminVolunteerMatchingService],
})
export class AdminVolunteerMatchingModule {}
