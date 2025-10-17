import { Test } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { NotificationType } from './interfaces/notification.interface';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [NotificationService],
    }).compile();

    service = moduleRef.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllNotifications', () => {
    it('should return all notifications for user', () => {
      const notifications = service.getAllNotifications(1);
      
      expect(notifications.length).toBeGreaterThan(0);
      notifications.forEach(notification => {
        expect(notification.userId).toBe(1);
      });
    });

    it('should filter unread notifications', () => {
      const notifications = service.getAllNotifications(1, 'unread');
      
      notifications.forEach(notification => {
        expect(notification.read).toBe(false);
      });
    });

    it('should filter by assignment type', () => {
      const notifications = service.getAllNotifications(1, 'assignment');
      
      notifications.forEach(notification => {
        expect(notification.type).toBe(NotificationType.ASSIGNMENT);
      });
    });
  });

  describe('getNotificationCounts', () => {
    it('should return correct counts for user', () => {
      const counts = service.getNotificationCounts(1);
      
      expect(counts.all).toBeDefined();
      expect(counts.unread).toBeDefined();
      expect(counts.assignment).toBeDefined();
      expect(counts.update).toBeDefined();
      expect(counts.reminder).toBeDefined();
    });
  });

  describe('createNotification', () => {
    it('should create a new notification', () => {
      const createDto = {
        type: NotificationType.REMINDER,
        title: 'Test Reminder',
        message: 'This is a test reminder',
        userId: 2,
      };

      const notification = service.createNotification(createDto);
      
      expect(notification.id).toBe(4);
      expect(notification.type).toBe(NotificationType.REMINDER);
      expect(notification.title).toBe('Test Reminder');
      expect(notification.read).toBe(false);
    });
  });

  describe('markAsRead', () => {
    it('should mark specified notifications as read', () => {
      const result = service.markAsRead([1, 2], 1);
      
      expect(result.markedCount).toBe(2);
    });

    it('should not mark notifications for wrong user', () => {
      const result = service.markAsRead([1, 2], 999);
      
      expect(result.markedCount).toBe(0);
    });
  });
});