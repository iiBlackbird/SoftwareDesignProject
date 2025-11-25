import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SuggestedMatchDto } from './dto/suggested-match.dto';
import { AssignVolunteerResponseDto } from './dto/assign-volunteer-response.dto';
//import { Prisma } from 'generated/prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminVolunteerMatchingService {
  constructor(private prisma: PrismaService) {}

  async getAllEvents() {
    const events = await this.prisma.event.findMany({
      where: { eventDate: { gte: new Date() } },
      select: { id: true, name: true }
    });
    return { events };
  }


  // Calculate match points between a user and an event
  private calculateMatchPoints(user: any, event: any): number {
    let points = 0;

    // Skills match (case-insensitive)
    const skillMatches = event.requiredSkills.filter((skill: string) =>
      user.skills.some((userSkill: string) => userSkill.toLowerCase() === skill.toLowerCase()),
    );
    points += skillMatches.length * 5;

    // Availability match
    const userAvailable = user.availability.some((avail: Date) => {
        return new Date(avail).toDateString() === new Date(event.eventDate).toDateString();
      });
    if (userAvailable) points += 3;
    // Location match (trimmed, case-insensitive)
    // Location matching logic 
    const eventLoc = event.location?.toLowerCase() || '';
    const city = user.city?.toLowerCase() || '';
    const state = user.state?.toLowerCase() || '';
    const zip = user.zipcode?.slice(0, 5)?.toLowerCase() || '';

    if (eventLoc.includes('online') || eventLoc.includes('virtual')) {
        // Universal events count for everyone
        points += 2;
    } else {
        // Case 1: both city and state appear - strong match
        if (eventLoc.includes(city) && eventLoc.includes(state)) {
        points += 2;
        }
        // Case 2: only city or state appears - partial match
        else if (eventLoc.includes(city) || eventLoc.includes(state)) {
        points += 1;
        }
        // Case 3: ZIP code appears in text 
        else if (zip && eventLoc.includes(zip)) {
        points += 1;
        }
    }

    // Urgency
    if (event.urgency.toLowerCase() === 'high') points += 1;

    return points;
  }

  // Get suggested matches for all users
  async getSuggestedMatches(): Promise<SuggestedMatchDto[]> {
    // Fetch upcoming events
    const events = await this.prisma.event.findMany({
      where: { eventDate: { gte: new Date() } },
    });

    // Fetch all user profiles
    const users = await this.prisma.userProfile.findMany();

    // Fetch all existing volunteer history
    const volunteerHistory = await this.prisma.volunteerHistory.findMany();

    const matches: SuggestedMatchDto[] = [];

    for (const user of users) {
      // Skip if user already matched or enrolled in any event
      const userAlreadyAssigned = volunteerHistory.some(
        (vh) =>
            vh.userId === user.userId &&
            ['Matched', 'Enrolled'].includes(vh.status)
      );
      if (userAlreadyAssigned) continue; // skip showing this user again

      let bestMatch: any = null;
      let maxPoints = -1;

      for (const event of events) {
        // Skip if user already assigned to this event
        const alreadyAssigned = volunteerHistory.some(
          (vh) => vh.userId === user.userId && vh.eventId === event.id,
        );
        if (alreadyAssigned) continue;

        const points = this.calculateMatchPoints(user, event);
        if (points > maxPoints) {
          maxPoints = points;
          bestMatch = event;
        } else if (points === maxPoints && bestMatch) {
          const urgencyOrder = { high: 3, medium: 2, low: 1 };
          if (urgencyOrder[event.urgency.toLowerCase()] > urgencyOrder[bestMatch.urgency.toLowerCase()]) {
            bestMatch = event;
          } else if (
            urgencyOrder[event.urgency.toLowerCase()] ===
            urgencyOrder[bestMatch.urgency.toLowerCase()]
          ) {
            if (new Date(event.eventDate) < new Date(bestMatch.eventDate)) {
              bestMatch = event;
            }
          }
        }
      }

      matches.push({
        volunteerId: user.userId,
        volunteerName: user.fullName,
        suggestedEvent: maxPoints > 0 && bestMatch ? bestMatch.name : 'No suitable match',
        suggestedEventId: maxPoints > 0 && bestMatch ? bestMatch.id : null,
      });
    }

    return matches;
  }

  // Assign a volunteer to an event
  async assignVolunteerToEvent(
    volunteerId: string,
    eventId: string,
  ): Promise<AssignVolunteerResponseDto> {
    // Check if already assigned
    const existing = await this.prisma.volunteerHistory.findFirst({
      where: { userId: volunteerId, eventId },
    });

    if (existing) {
      return {
        message: 'Volunteer already matched, status updated.',
        record: existing,
      };
    }

    const newRecord = await this.prisma.volunteerHistory.create({
      data: {
        userId: volunteerId,
        eventId,
        status: 'Matched',
      },
    });

    return {
      message: 'Volunteer assigned successfully.',
      record: newRecord,
    };
  }
}
