import { Injectable } from '@nestjs/common';
import { SuggestedMatchDto, AssignVolunteerResponseDto } from './dto';

interface UserProfile {
  id: number;
  name: string;
  skills: string[];
  availability: string[];
  location: string;
}

interface EventDetails {
  eventId: number;
  eventName: string;
  requiredSkills: string[];
  date: string;
  location: string;
  urgency: 'Low' | 'Medium' | 'High';
}

interface VolunteerHistory {
  id: number;
  userId: number;
  eventId: number;
  status: string; // 'assigned', 'enrolled', 'completed'
}

@Injectable()
export class AdminVolunteerMatchingService {
  private users: UserProfile[] = [
    { id: 1, name: 'John Smith', skills: ['First Aid', 'Teamwork'], availability: ['Mon', 'Wed'], location: 'City Center' },
    { id: 2, name: 'Karen John', skills: ['Cooking', 'Organization'], availability: ['Tue', 'Thu'], location: 'Suburbs' },
  ];

  private events: EventDetails[] = [
    { eventId: 1, eventName: 'Blood Drive', requiredSkills: ['First Aid', 'Organization'], date: '2025-10-20', location: 'City Center', urgency: 'High' },
    { eventId: 2, eventName: 'Meal Kit Assembly', requiredSkills: ['Cooking', 'Teamwork'], date: '2025-11-15', location: 'Community Center', urgency: 'Medium' },
    { eventId: 3, eventName: 'Park Cleanup', requiredSkills: ['Cleaning', 'Teamwork'], date: '2025-10-22', location: 'Central Park', urgency: 'Low' },
  ];

  private volunteerHistory: VolunteerHistory[] = [];

  private calculateMatchPoints(user: UserProfile, event: EventDetails): number {
    let points = 0;
    const skillMatches = event.requiredSkills.filter(skill => user.skills.includes(skill));
    points += skillMatches.length * 5;

    // Availability match (mock)
    points += 3;

    // Location proximity
    if (user.location === event.location) points += 2;

    // Urgency
    if (event.urgency === 'High') points += 1;

    return points;
  }

  getSuggestedMatches(): SuggestedMatchDto[] {
    return this.users.map(user => {
      let bestMatch: EventDetails | null = null;
      let maxPoints = -1;

      for (const event of this.events) {
        const points = this.calculateMatchPoints(user, event);
        if (points > maxPoints) {
          maxPoints = points;
          bestMatch = event;
        }
      }

      return {
        volunteerId: user.id,
        volunteerName: user.name,
        suggestedEvent: maxPoints > 0 && bestMatch ? bestMatch.eventName : 'No suitable match',
        suggestedEventId: maxPoints > 0 && bestMatch ? bestMatch.eventId : null,
      };
    });
  }

  assignVolunteerToEvent(volunteerId: number, eventId: number): AssignVolunteerResponseDto {
    const existing = this.volunteerHistory.find(vh => vh.userId === volunteerId && vh.eventId === eventId);

    if (existing) {
      existing.status = 'assigned';
      return {
        message: 'Volunteer already matched, status updated.',
        record: { ...existing },
      };
    }

    const newRecord: VolunteerHistory = {
      id: this.volunteerHistory.length + 1,
      userId: volunteerId,
      eventId,
      status: 'assigned',
    };

    this.volunteerHistory.push(newRecord);

    // remove volunteer from list after assignment
    const userIndex = this.users.findIndex(u => u.id === volunteerId);
    if (userIndex !== -1) {
        this.users.splice(userIndex, 1); // removes the volunteer
    }

    return {
      message: 'Volunteer assigned successfully.',
      record: { ...newRecord },
    };
  }
}
