import { IsOptional, IsString, IsArray, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { EventUrgency } from './create-event.dto';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  eventName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @IsOptional()
  @IsEnum(EventUrgency)
  urgency?: EventUrgency;

  @IsOptional()
  @IsDateString()
  eventDate?: string;
}