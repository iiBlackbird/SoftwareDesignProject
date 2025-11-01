import { IsEnum, IsOptional, IsString, IsBoolean, IsDateString, Length } from 'class-validator';

export enum NotificationType {
  ASSIGNMENT = 'assignment',
  UPDATE = 'update',
  REMINDER = 'reminder',
}

export class CreateNotificationDto {
  @IsEnum(NotificationType, { 
    message: 'Type must be one of: assignment, update, reminder' 
  })
  type: NotificationType;

  @IsString()
  @Length(1, 255, { 
    message: 'Title must be between 1 and 255 characters' 
  })
  title: string;

  @IsString()
  @Length(1, 1000, { 
    message: 'Message must be between 1 and 1000 characters' 
  })
  message: string;

  @IsString()
  @IsDateString({}, { 
    message: 'Time must be a valid ISO date string' 
  })
  time: string;

  @IsBoolean()
  @IsOptional()
  read?: boolean;

  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  eventId?: string;
}