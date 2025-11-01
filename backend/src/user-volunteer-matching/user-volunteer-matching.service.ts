import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserVolunteerMatchingService {
  constructor(private prisma: PrismaService) {}

  //  Get all matched events for a specific user
  async getMatchedEventsForUser(userId: string) {
    const matchedRecords = await this.prisma.volunteerHistory.findMany({
      where: {
        userId,
        status: 'Matched',
      },
      include: {
        event: true, // bring in full event details
      },
    });

    // Transform results into a clean structure for frontend
    return matchedRecords.map((record) => ({
      id: record.id,
      eventId: record.event.id,
      eventName: record.event.name,
      description: record.event.description,
      location: record.event.location,
      requiredSkills: record.event.requiredSkills,
      urgency: record.event.urgency,
      eventDate: record.event.eventDate.toISOString().split('T')[0],
      status: record.status,
    }));
  }

  //  When user clicks "Enroll" → update status from 'Matched' → 'Enrolled'
  async enrollInEvent(userId: string, eventId: string) {
    const existingRecord = await this.prisma.volunteerHistory.findFirst({
      where: { userId, eventId, status: 'Matched' },
    });

    if (!existingRecord) {
      throw new Error('No matched record found for this event and user');
    }

    return this.prisma.volunteerHistory.update({
      where: { id: existingRecord.id },
      data: { status: 'Enrolled' },
    });
  }
}
