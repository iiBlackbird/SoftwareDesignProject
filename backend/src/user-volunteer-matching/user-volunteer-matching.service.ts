import { Injectable } from '@nestjs/common';

@Injectable()
export class UserVolunteerMatchingService {
    // mock EventDetails table
    private eventDetails = [
        {
        eventId: 1,
        eventName: 'Blood Drive',
        description: 'Assist with first aid at the community blood drive.',
        location: 'Red Cross Center',
        requiredSkills: ['First Aid', 'Organization'],
        urgency: 'High',
        eventDate: '2025-10-20',
        },
        {
        eventId: 2,
        eventName: 'Park Cleanup',
        description: 'Help clean up and beautify the local park.',
        location: 'Central Park',
        requiredSkills: ['Teamwork', 'Cleaning'],
        urgency: 'Medium',
        eventDate: '2025-10-22',
        },
        {
        eventId: 3,
        eventName: 'Food Pantry Support',
        description: 'Distribute food items and manage pantry stock.',
        location: 'Community Center',
        requiredSkills: ['Organization', 'Lifting'],
        urgency: 'Low',
        eventDate: '2025-10-25',
        },
    ];

    // mock VolunteerHistory table
    private volunteerHistory = [
        { id: 1, userId: 1, eventId: 1, status: 'assigned' },
        { id: 2, userId: 1, eventId: 3, status: 'enrolled' },
        { id: 3, userId: 2, eventId: 2, status: 'completed' },
    ];

    // mock UserProfile table 
    private users = [
        { id: 1, name: 'John Doe', skills: ['First Aid', 'Teamwork'], location: 'City Center' },
        { id: 2, name: 'Jane Smith', skills: ['Cooking', 'Organization'], location: 'Suburbs' },
    ];

    getUserMatches(userId: number) {
        // check if user exists
        const user = this.users.find((u) => u.id === userId);
        if (!user) return [];

        // find volunteer history records for this user
        const userHistory = this.volunteerHistory.filter((vh) => vh.userId === userId);

        // for each record, attach the matching event details
        const matchedEvents = userHistory.map((vh) => {
        const event = this.eventDetails.find((e) => e.eventId === vh.eventId);
        return event
            ? {
                ...event,
                status: vh.status, // add the volunteer’s status to the event info
            }
            : null;
        }).filter((e) => e !== null);

        return matchedEvents;
    }
}
