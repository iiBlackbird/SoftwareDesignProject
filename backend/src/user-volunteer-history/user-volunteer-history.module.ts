import { Module } from '@nestjs/common';
import { UserVolunteerHistoryService } from './user-volunteer-history.service';
import { UserVolunteerHistoryController } from './user-volunteer-history.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [UserVolunteerHistoryController],
    providers: [UserVolunteerHistoryService],
})
export class UserVolunteerHistoryModule {}