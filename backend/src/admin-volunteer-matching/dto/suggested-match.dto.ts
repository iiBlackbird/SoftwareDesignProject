import { IsInt, IsNotEmpty, Min } from 'class-validator';

// Volunteer match suggestion DTO
export class SuggestedMatchDto {
    volunteerId: string;
    volunteerName: string;
    suggestedEvent: string;
    suggestedEventId: string | null;
}