import { 
  Controller, Get, Patch, Param, Query, UseGuards, Req, 
  ParseIntPipe, DefaultValuePipe, UsePipes, ValidationPipe,
  BadRequestException 
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationType } from './dto/create-notification.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true 
}))
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(
    @Req() req: any,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    const userId = req.user.id;
    const result = await this.notificationService.getUserNotifications(userId, {
      unreadOnly: unreadOnly === 'true',
      limit,
      page,
    });
    
    return {
      success: true,
      data: {
        notifications: result.notifications,
        counts: result.counts,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        hasNext: result.hasNext,
      },
    };
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req) {
    const userId = req.user.id;
    const count = await this.notificationService.getUnreadCount(userId);
    return {
      success: true,
      data: { count },
    };
  }

  @Get('recent')
  async getRecentNotifications(@Req() req) {
    const userId = req.user.id;
    const notifications = await this.notificationService.getRecentNotifications(userId);
    return {
      success: true,
      data: { notifications },
    };
  }

  @Get('type/:type')
  async getNotificationsByType(
    @Req() req,
    @Param('type') type: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    const userId = req.user.id;
    
    // Convert string parameter to NotificationType enum
    let notificationType: NotificationType;
    switch (type) {
      case 'assignment':
        notificationType = NotificationType.ASSIGNMENT;
        break;
      case 'update':
        notificationType = NotificationType.UPDATE;
        break;
      case 'reminder':
        notificationType = NotificationType.REMINDER;
        break;
      default:
        throw new BadRequestException('Invalid notification type. Use: assignment, update, or reminder');
    }
    
    const result = await this.notificationService.getNotificationsByType(
      userId, 
      notificationType, 
      { limit, page }
    );
    
    return {
      success: true,
      data: result,
    };
  }

  @Get(':id')
  async getNotificationById(@Req() req, @Param('id') notificationId: string) {
    const userId = req.user.id;
    const notification = await this.notificationService.getNotificationById(notificationId, userId);
    return {
      success: true,
      data: { notification },
    };
  }

  @Patch(':id/read')
  async markAsRead(@Req() req, @Param('id') notificationId: string) {
    const userId = req.user.id;
    const result = await this.notificationService.markAsRead(notificationId, userId);
    
    return {
      success: true,
      data: result,
      message: result.message,
    };
  }

  @Patch('mark-all-read')
  async markAllAsRead(@Req() req) {
    const userId = req.user.id;
    const result = await this.notificationService.markAllAsRead(userId);
    
    return {
      success: true,
      data: result,
      message: result.message,
    };
  }

  @Patch(':id/delete')
  async deleteNotification(@Req() req, @Param('id') notificationId: string) {
    const userId = req.user.id;
    const result = await this.notificationService.deleteNotification(notificationId, userId);
    
    return {
      success: true,
      data: result,
      message: result.message,
    };
  }
}