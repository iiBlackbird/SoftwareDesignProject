import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto, NotificationType } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private prisma: PrismaService) {}

  async createNotification(data: CreateNotificationDto) {
    try {
      return await this.prisma.notification.create({
        data: {
          type: data.type,
          title: data.title,
          message: data.message,
          time: data.time,
          read: data.read || false,
          userId: data.userId,
          eventId: data.eventId,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create notification: ${error.message}`);
      throw new InternalServerErrorException(`Failed to create notification: ${error.message}`);
    }
  }

  async createBulkNotifications(notificationsData: CreateNotificationDto[]) {
    try {
      return await this.prisma.notification.createMany({
        data: notificationsData.map(notification => ({
          type: notification.type,
          title: notification.title,
          message: notification.message,
          time: notification.time,
          read: notification.read || false,
          userId: notification.userId,
          eventId: notification.eventId,
        })),
      });
    } catch (error) {
      this.logger.error(`Failed to create bulk notifications: ${error.message}`);
      throw error;
    }
  }

  async notifyVolunteersOfNewEvent(event: {
  id: string;
  name: string;
  requiredSkills: string[];
}) {
  try {
    
    const matchingUsers = await this.prisma.userProfile.findMany({
      where: {
        skills: {
          hasSome: event.requiredSkills,
        },
        
      },
      select: {
        userId: true,
      },
    });

    if (matchingUsers.length === 0) {
      this.logger.log(`No matching volunteers found for event: ${event.name}`);
      return;
    }

    const notifications = matchingUsers.map(user => ({
      type: NotificationType.ASSIGNMENT,
      title: 'New Event Matches Your Skills!',
      message: `The event "${event.name}" is looking for volunteers with skills like yours.`,
      time: new Date().toISOString(),
      read: false,
      userId: user.userId,
      eventId: event.id,
    }));

    const result = await this.createBulkNotifications(notifications);
    this.logger.log(`Sent ${result.count} notifications for event: ${event.name}`);
    return result;
  } catch (error) {
    this.logger.error(`Failed to notify volunteers for event ${event.name}: ${error.message}`);
    throw error;
  }
}

  async sendEventUpdateNotification(event: {
    id: string;
    name: string;
  }, userIds: string[]) {
    try {
      const notifications = userIds.map(userId => ({
        type: NotificationType.UPDATE,
        title: 'Event Updated',
        message: `The event "${event.name}" has been updated. Please review the changes.`,
        time: new Date().toISOString(),
        read: false,
        userId: userId,
        eventId: event.id,
      }));

      return await this.createBulkNotifications(notifications);
    } catch (error) {
      this.logger.error(`Failed to send event update notifications: ${error.message}`);
      throw error;
    }
  }

  async sendReminderNotification(event: {
    id: string;
    name: string;
    date: Date;
  }, userIds: string[]) {
    try {
      const notifications = userIds.map(userId => ({
        type: NotificationType.REMINDER,
        title: 'Event Reminder',
        message: `Reminder: The event "${event.name}" is coming up soon!`,
        time: new Date().toISOString(),
        read: false,
        userId: userId,
        eventId: event.id,
      }));

      return await this.createBulkNotifications(notifications);
    } catch (error) {
      this.logger.error(`Failed to send reminder notifications: ${error.message}`);
      throw error;
    }
  }

  async getUserNotifications(userId: string, options: { 
    unreadOnly?: boolean; 
    limit?: number; 
    page?: number; 
  } = {}) {
    const { unreadOnly = false, limit = 20, page = 1 } = options;
    
    const where: any = { userId };
    if (unreadOnly) {
      where.read = false;
    }

    try {
      const [notifications, total] = await Promise.all([
        this.prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: (page - 1) * limit,
        }),
        this.prisma.notification.count({ where }),
      ]);

      return {
        notifications,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Failed to get notifications for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async getNotificationById(id: string, userId: string) {
    try {
      return await this.prisma.notification.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
          event: {
            select: {
              id: true,
              name: true,
              eventDate: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Failed to get notification ${id}: ${error.message}`);
      throw error;
    }
  }

  async markAsRead(notificationId: string, userId: string) {
    try {
      return await this.prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId: userId,
        },
        data: {
          read: true,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to mark notification ${notificationId} as read: ${error.message}`);
      throw error;
    }
  }

  async markAllAsRead(userId: string) {
    try {
      return await this.prisma.notification.updateMany({
        where: {
          userId,
          read: false,
        },
        data: {
          read: true,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to mark all notifications as read for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async getUnreadCount(userId: string) {
    try {
      return await this.prisma.notification.count({
        where: {
          userId,
          read: false,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to get unread count for user ${userId}: ${error.message}`);
      throw error;
    }
  }
}