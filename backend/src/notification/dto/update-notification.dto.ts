import { IsEnum, IsOptional, IsString, IsBoolean, IsDateString, Length } from 'class-validator';
import { NotificationType } from './create-notification.dto';

export class UpdateNotificationDto {
  @IsEnum(NotificationType, { 
    message: 'Type must be one of: assignment, update, reminder' 
  })
  @IsOptional()
  type?: NotificationType;

  @IsString()
  @Length(1, 255, { 
    message: 'Title must be between 1 and 255 characters' 
  })
  @IsOptional()
  title?: string;

  @IsString()
  @Length(1, 1000, { 
    message: 'Message must be between 1 and 1000 characters' 
  })
  @IsOptional()
  message?: string;

  @IsString()
  @IsDateString({}, { 
    message: 'Time must be a valid ISO date string' 
  })
  @IsOptional()
  time?: string;

  @IsBoolean()
  @IsOptional()
  read?: boolean;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsOptional()
  @IsString()
  eventId?: string;
}