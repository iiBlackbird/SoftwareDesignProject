import { Module } from'@nestjs/common';
import { VolunteerHistoryController } from './volunteer-history.controller';
import { VolunteerHistoryService } from './volunteer-history.service';

@Module({
    controllers: [VolunteerHistoryController],
    providers: [VolunteerHistoryService],
})

export class VolunteerHistoryModule {}