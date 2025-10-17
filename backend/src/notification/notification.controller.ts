import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  ParseIntPipe, 
  ValidationPipe 
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { MarkAsReadDto } from './dto/mark-as-read.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('user/:userId')
  getNotifications(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('filter') filter?: string,
  ) {
    const notifications = this.notificationService.getAllNotifications(userId, filter);
    const counts = this.notificationService.getNotificationCounts(userId);

    return {
      success: true,
      data: {
        notifications,
        counts,
      },
    };
  }

  @Post()
  createNotification(@Body(ValidationPipe) createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationService.createNotification(createNotificationDto);
    
    return {
      success: true,
      data: notification,
    };
  }

  @Post('user/:userId/mark-read')
  markAsRead(
    @Param('userId', ParseIntPipe) userId: number,
    @Body(ValidationPipe) markAsReadDto: MarkAsReadDto,
  ) {
    const result = this.notificationService.markAsRead(markAsReadDto.notificationIds, userId);
    
    return {
      success: true,
      data: result,
    };
  }

  @Post('user/:userId/mark-all-read')
  markAllAsRead(@Param('userId', ParseIntPipe) userId: number) {
    const result = this.notificationService.markAllAsRead(userId);
    
    return {
      success: true,
      data: result,
    };
  }
}