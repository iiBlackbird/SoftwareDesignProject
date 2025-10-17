import { Injectable } from '@nestjs/common';
import { Notification, NotificationType } from './interfaces/notification.interface';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  private notifications: Notification[] = [
    {
      id: 1,
      type: NotificationType.ASSIGNMENT,
      title: 'New Event Assignment',
      message: 'You have been assigned to "Beach Cleanup Day" on Saturday, October 15.',
      time: '10 minutes ago',
      read: false,
      userId: 1,
      eventId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      type: NotificationType.UPDATE,
      title: 'Event Schedule Changed',
      message: 'The "Food Drive" event has been rescheduled to November 5th.',
      time: '2 hours ago',
      read: false,
      userId: 1,
      eventId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      type: NotificationType.REMINDER,
      title: 'Upcoming Event Reminder',
      message: 'Remember your commitment to "Park Restoration" this Saturday at 9 AM.',
      time: '1 day ago',
      read: true,
      userId: 1,
      eventId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  private nextId = 4;

  getAllNotifications(userId: number, filter?: string): Notification[] {
    let filtered = this.notifications.filter(n => n.userId === userId);
    
    if (filter) {
      switch (filter) {
        case 'unread':
          filtered = filtered.filter(n => !n.read);
          break;
        case 'assignment':
          filtered = filtered.filter(n => n.type === NotificationType.ASSIGNMENT);
          break;
        case 'update':
          filtered = filtered.filter(n => n.type === NotificationType.UPDATE);
          break;
        case 'reminder':
          filtered = filtered.filter(n => n.type === NotificationType.REMINDER);
          break;
      }
    }
    
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getNotificationCounts(userId: number): { [key: string]: number } {
    const userNotifications = this.notifications.filter(n => n.userId === userId);
    
    return {
      all: userNotifications.length,
      unread: userNotifications.filter(n => !n.read).length,
      assignment: userNotifications.filter(n => n.type === NotificationType.ASSIGNMENT).length,
      update: userNotifications.filter(n => n.type === NotificationType.UPDATE).length,
      reminder: userNotifications.filter(n => n.type === NotificationType.REMINDER).length,
    };
  }

  createNotification(createNotificationDto: CreateNotificationDto): Notification {
    const notification: Notification = {
      id: this.nextId++,
      type: createNotificationDto.type,
      title: createNotificationDto.title,
      message: createNotificationDto.message,
      time: 'Just now',
      read: false,
      userId: createNotificationDto.userId,
      eventId: createNotificationDto.eventId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.notifications.push(notification);
    return notification;
  }

  markAsRead(notificationIds: number[], userId: number): { markedCount: number } {
    let markedCount = 0;
    
    this.notifications.forEach(notification => {
      if (notificationIds.includes(notification.id) && notification.userId === userId && !notification.read) {
        notification.read = true;
        notification.updatedAt = new Date();
        markedCount++;
      }
    });

    return { markedCount };
  }

  markAllAsRead(userId: number): { markedCount: number } {
    let markedCount = 0;
    
    this.notifications.forEach(notification => {
      if (notification.userId === userId && !notification.read) {
        notification.read = true;
        notification.updatedAt = new Date();
        markedCount++;
      }
    });

    return { markedCount };
  }

  getNotificationById(id: number, userId: number): Notification | null {
    return this.notifications.find(n => n.id === id && n.userId === userId) || null;
  }
}