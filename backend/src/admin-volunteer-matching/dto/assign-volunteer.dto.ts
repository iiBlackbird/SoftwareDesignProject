import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AssignVolunteerDto {
    @IsNotEmpty()
    volunteerId: string;

    @IsNotEmpty()
    eventId: string;
}