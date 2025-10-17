import { IsEnum, IsString, IsInt, Min, MaxLength, IsOptional } from 'class-validator';
import { NotificationType } from '../interfaces/notification.interface';

export class CreateNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @MaxLength(500)
  message: string;

  @IsInt()
  @Min(1)
  userId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  eventId?: number;
}