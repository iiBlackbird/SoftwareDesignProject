import { Module } from '@nestjs/common';
import { UserVolunteerMatchingController } from './user-volunteer-matching.controller';
import { UserVolunteerMatchingService } from './user-volunteer-matching.service';
import { PrismaModule } from '../prisma/prisma.module'; 

@Module({
  imports: [PrismaModule], 
  controllers: [UserVolunteerMatchingController],
  providers: [UserVolunteerMatchingService],
})
export class UserVolunteerMatchingModule {}
