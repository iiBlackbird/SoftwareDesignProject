import { Module } from '@nestjs/common';
import { AdminVolunteerMatchingService } from './admin-volunteer-matching.service';
import { AdminVolunteerMatchingController } from './admin-volunteer-matching.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [AdminVolunteerMatchingController],
    providers: [AdminVolunteerMatchingService, PrismaService],
})
export class AdminVolunteerMatchingModule {}
