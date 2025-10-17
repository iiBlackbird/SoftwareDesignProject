import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AssignVolunteerDto {
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    volunteerId: number;
  
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    eventId: number;
}