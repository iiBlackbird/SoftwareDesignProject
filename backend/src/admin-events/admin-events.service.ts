import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUpcomingEvents() {
    const today = new Date();
  
    // Reset time to midnight to include all events happening today or later
    today.setHours(0, 0, 0, 0);
  
    const events = await this.prisma.event.findMany({
      where: {
        eventDate: {
          gte: today,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        requiredSkills: true,
        urgency: true,
        eventDate: true,
      },
      orderBy: {
        eventDate: 'asc',
      },
    });
    console.log(events);
  
    return events;
  }
  
}
