import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 

@Injectable()
export class UserVolunteerHistoryService {
  constructor(private prisma: PrismaService) {}

  async getUserHistory(userId: string) {
    return this.prisma.volunteerHistory.findMany({
      where: { userId },
      include: {
        event: true, // include event details
      },
    });
  }
}
