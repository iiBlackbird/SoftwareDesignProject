import { IsInt, IsNotEmpty, Min } from 'class-validator';

// Volunteer match suggestion DTO
export class SuggestedMatchDto {
    volunteerId: number;
    volunteerName: string;
    suggestedEvent: string;
    suggestedEventId: number | null;
}