import { Injectable, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

  /**
   * Get user-specific notifications with enhanced filtering and counts
   */
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
      const [notifications, total, unreadCount] = await Promise.all([
        this.prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: (page - 1) * limit,
          include: {
            event: {
              select: {
                id: true,
                name: true,
                eventDate: true,
                location: true,
              },
            },
          },
        }),
        this.prisma.notification.count({ where }),
        this.prisma.notification.count({
          where: { ...where, read: false },
        }),
      ]);

      // Calculate type counts
      const assignmentCount = await this.prisma.notification.count({
        where: { ...where, type: NotificationType.ASSIGNMENT },
      });
      
      const updateCount = await this.prisma.notification.count({
        where: { ...where, type: NotificationType.UPDATE },
      });
      
      const reminderCount = await this.prisma.notification.count({
        where: { ...where, type: NotificationType.REMINDER },
      });

      // Transform notifications for frontend
      const transformedNotifications = notifications.map(notification => ({
        id: notification.id,
        type: notification.type as 'assignment' | 'update' | 'reminder',
        title: notification.title,
        message: notification.message,
        time: this.formatTimeForDisplay(notification.time || notification.createdAt),
        read: notification.read,
        userId: notification.userId,
        eventId: notification.eventId,
        createdAt: notification.createdAt.toISOString(),
        event: notification.event,
      }));

      return {
        notifications: transformedNotifications,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        counts: {
          all: total,
          unread: unreadCount,
          assignment: assignmentCount,
          update: updateCount,
          reminder: reminderCount,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get notifications for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async getNotificationById(id: string, userId: string) {
    try {
      const notification = await this.prisma.notification.findFirst({
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
              location: true,
              description: true,
            },
          },
        },
      });

      if (!notification) {
        throw new NotFoundException('Notification not found');
      }

      return notification;
    } catch (error) {
      this.logger.error(`Failed to get notification ${id}: ${error.message}`);
      throw error;
    }
  }

  async markAsRead(notificationId: string, userId: string) {
    try {
      const result = await this.prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId: userId,
        },
        data: {
          read: true,
        },
      });

      if (result.count === 0) {
        throw new NotFoundException('Notification not found or access denied');
      }

      return {
        count: result.count,
        message: 'Notification marked as read successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to mark notification ${notificationId} as read: ${error.message}`);
      throw error;
    }
  }

  async markAllAsRead(userId: string) {
    try {
      const result = await this.prisma.notification.updateMany({
        where: {
          userId,
          read: false,
        },
        data: {
          read: true,
        },
      });

      return {
        count: result.count,
        message: `Marked ${result.count} notifications as read`,
      };
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

  /**
   * Get notifications by type for a specific user
   */
  async getNotificationsByType(
    userId: string,
    type: NotificationType,
    options: { limit?: number; page?: number } = {},
  ) {
    const { limit = 20, page = 1 } = options;

    const where = {
      userId,
      type,
    };

    try {
      const [notifications, total] = await Promise.all([
        this.prisma.notification.findMany({
          where,
          take: limit,
          skip: (page - 1) * limit,
          orderBy: { createdAt: 'desc' },
          include: {
            event: {
              select: {
                id: true,
                name: true,
                eventDate: true,
              },
            },
          },
        }),
        this.prisma.notification.count({ where }),
      ]);

      const transformedNotifications = notifications.map(notification => ({
        id: notification.id,
        type: notification.type as 'assignment' | 'update' | 'reminder',
        title: notification.title,
        message: notification.message,
        time: this.formatTimeForDisplay(notification.time || notification.createdAt),
        read: notification.read,
        userId: notification.userId,
        eventId: notification.eventId,
        createdAt: notification.createdAt.toISOString(),
        event: notification.event,
      }));

      return {
        notifications: transformedNotifications,
        total,
        type,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Failed to get ${type} notifications for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get recent notifications (last 7 days) for a user
   */
  async getRecentNotifications(userId: string, limit: number = 10) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          userId: userId,
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          event: {
            select: {
              id: true,
              name: true,
              eventDate: true,
            },
          },
        },
      });

      return notifications.map(notification => ({
        id: notification.id,
        type: notification.type as 'assignment' | 'update' | 'reminder',
        title: notification.title,
        message: notification.message,
        time: this.formatTimeForDisplay(notification.time || notification.createdAt),
        read: notification.read,
        createdAt: notification.createdAt.toISOString(),
        event: notification.event,
      }));
    } catch (error) {
      this.logger.error(`Failed to get recent notifications for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a notification (user-specific)
   */
  async deleteNotification(notificationId: string, userId: string) {
    try {
      const result = await this.prisma.notification.deleteMany({
        where: {
          id: notificationId,
          userId: userId,
        },
      });

      if (result.count === 0) {
        throw new NotFoundException('Notification not found or access denied');
      }

      return {
        count: result.count,
        message: 'Notification deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to delete notification ${notificationId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Helper method to format time for display (consistent with frontend)
   */
  private formatTimeForDisplay(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)} minutes ago`;
    }
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    }
    return `${Math.floor(diffInHours / 24)} days ago`;
  }

  /**
   * Create notification when user signs up for an event
   */
  async createEventSignupNotification(userId: string, event: { id: string; name: string }) {
    try {
      return await this.createNotification({
        type: NotificationType.ASSIGNMENT,
        title: 'Volunteer Assignment Confirmed',
        message: `You have successfully signed up for "${event.name}"!`,
        time: new Date().toISOString(),
        read: false,
        userId: userId,
        eventId: event.id,
      });
    } catch (error) {
      this.logger.error(`Failed to create event signup notification: ${error.message}`);
      throw error;
    }
  }
}