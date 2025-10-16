// Volunteer match suggestion DTO
export class SuggestedMatchDto {
    volunteerId: number;
    volunteerName: string;
    suggestedEvent: string;
    suggestedEventId: number | null;
  }
  
  // Response DTO for assigning volunteer
  export class AssignVolunteerResponseDto {
    message: string;
    record?: {
      id: number;
      userId: number;
      eventId: number;
      status: string;
    };
  }
  