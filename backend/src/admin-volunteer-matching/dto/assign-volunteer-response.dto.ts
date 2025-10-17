import { IsInt, IsNotEmpty, Min } from 'class-validator';

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