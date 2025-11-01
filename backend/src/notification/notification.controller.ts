import { 
  Controller, Get, Patch, Param, Query, UseGuards, Req, 
  ParseIntPipe, DefaultValuePipe, UsePipes, ValidationPipe 
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
    @Req() req,
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
      data: result,
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

  @Patch(':id/read')
  async markAsRead(@Req() req, @Param('id') notificationId: string) {
    const userId = req.user.id;
    const result = await this.notificationService.markAsRead(notificationId, userId);
    
    return {
      success: true,
      data: result,
      message: result.count > 0 ? 'Notification marked as read' : 'Notification not found',
    };
  }

  @Patch('mark-all-read')
  async markAllAsRead(@Req() req) {
    const userId = req.user.id;
    const result = await this.notificationService.markAllAsRead(userId);
    
    return {
      success: true,
      data: result,
      message: 'All notifications marked as read',
    };
  }
}