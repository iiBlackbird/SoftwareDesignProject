import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VolunteerHistoryService {
  constructor(private prisma: PrismaService) {}

  // Fetch all volunteer history records, joined with User and Event tables
  async findAll() {
    const records = await this.prisma.volunteerHistory.findMany({
      include: { user: true, event: true },
    });

    // Transform data so it matches what your frontend expects
    return records.map((record) => ({
      id: record.id,
      volunteerName: record.user.fullName,
      eventName: record.event.name,
      eventDescription: record.event.description,
      location: record.event.location,
      requiredSkills: record.event.requiredSkills,
      urgency: record.event.urgency,
      eventDate: record.event.eventDate.toISOString().split('T')[0],
      participationStatus: record.status,
    }));
  }

  // Fetch volunteer history for a specific volunteer by name
  async findByVolunteer(name: string) {
    const records = await this.prisma.volunteerHistory.findMany({
      where: {
        user: {
          fullName: {
            equals: name,
            mode: 'insensitive', // case-insensitive search
          },
        },
      },
      include: { user: true, event: true },
    });

    return records.map((record) => ({
      id: record.id,
      volunteerName: record.user.fullName,
      eventName: record.event.name,
      eventDescription: record.event.description,
      location: record.event.location,
      requiredSkills: record.event.requiredSkills,
      urgency: record.event.urgency,
      eventDate: record.event.eventDate.toISOString().split('T')[0],
      participationStatus: record.status,
    }));
  }
}
