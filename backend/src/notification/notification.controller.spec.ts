import { Test } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationType } from './interfaces/notification.interface';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [NotificationService],
    }).compile();

    controller = moduleRef.get<NotificationController>(NotificationController);
    service = moduleRef.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNotifications', () => {
    it('should return notifications for user', () => {
      const result = controller.getNotifications(1, 'all');
      
      expect(result.success).toBe(true);
      expect(result.data.notifications).toBeDefined();
      expect(result.data.counts).toBeDefined();
    });

    it('should filter unread notifications', () => {
      const result = controller.getNotifications(1, 'unread');
      
      expect(result.success).toBe(true);
      // All returned notifications should be unread
      result.data.notifications.forEach(notification => {
        expect(notification.read).toBe(false);
      });
    });
  });

  describe('createNotification', () => {
    it('should create a new notification', () => {
      const createDto = {
        type: NotificationType.REMINDER,
        title: 'Test Notification',
        message: 'This is a test notification',
        userId: 2,
      };

      const result = controller.createNotification(createDto);
      
      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Test Notification');
      expect(result.data.type).toBe(NotificationType.REMINDER);
    });
  });

  describe('markAsRead', () => {
    it('should mark notifications as read', () => {
      const markAsReadDto = {
        notificationIds: [1, 2],
      };

      const result = controller.markAsRead(1, markAsReadDto);
      
      expect(result.success).toBe(true);
      expect(result.data.markedCount).toBeDefined();
    });
  });
});