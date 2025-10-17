import { IsNotEmpty, IsString, IsArray, IsEnum, IsDateString, MaxLength } from 'class-validator';

export enum EventUrgency {
  LOW = 'Low',
  NORMAL = 'Normal',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  eventName: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  requiredSkills: string[];

  @IsNotEmpty()
  @IsEnum(EventUrgency)
  urgency: EventUrgency;

  @IsNotEmpty()
  @IsDateString()
  eventDate: string;
}