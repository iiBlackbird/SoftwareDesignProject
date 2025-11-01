import { Module } from'@nestjs/common';
import { VolunteerHistoryController } from './volunteer-history.controller';
import { VolunteerHistoryService } from './volunteer-history.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [VolunteerHistoryController],
    providers: [VolunteerHistoryService, PrismaService],
})

export class VolunteerHistoryModule {}