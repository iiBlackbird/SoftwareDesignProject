import { Injectable } from '@nestjs/common';

@Injectable()
export class UserVolunteerHistoryService {
    private userHistory = [
        {
            id: 1,
            eventName: 'Meal Kit Assembly',
            eventDescription:
            'Volunteers assemble pre-portioned ingredients and recipes into meal kits',
            location: 'School',
            requiredSkills: ['Cooking'],
            urgency: 'High',
            eventDate: '2025-11-15',
            participationStatus: 'Attending',
            userId: 1, // link to a logged-in user
        },
        {
            id: 2,
            eventName: 'Park Cleanup',
            eventDescription: 'Clean and maintain the community park',
            location: 'Community Park',
            requiredSkills: ['Cleaning', 'Teamwork'],
            urgency: 'Medium',
            eventDate: '2025-10-20',
            participationStatus: 'Completed',
            userId: 2,
        },
    ];
  
    getUserHistory(userId: number) {
        // Filter history for this user
        return this.userHistory.filter((record) => record.userId === userId);
    }
}