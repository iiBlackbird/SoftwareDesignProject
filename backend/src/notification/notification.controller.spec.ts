import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;

  const mockNotifications = [
    { 
      id: 'notif1', 
      type: 'assignment', 
      title: 'Event Assignment', 
      message: 'You have been assigned to an event', 
      time: '2023-10-25T10:30:00Z', 
      read: false, 
      userId: 'user1', 
      eventId: 'event1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 'notif2', 
      type: 'reminder', 
      title: 'Event Reminder', 
      message: 'Your event is tomorrow', 
      time: '2023-10-25T10:30:00Z', 
      read: true, 
      userId: 'user1', 
      eventId: 'event2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ];

    const mockNotificationService = {

      getUserNotifications: jest.fn(),

      getUnreadCount: jest.fn(),

      markAsRead: jest.fn(),

      markAllAsRead: jest.fn(),

      getRecentNotifications: jest.fn(),

      getNotificationsByType: jest.fn(),

      getNotificationById: jest.fn(),

      deleteNotification: jest.fn(),

    };

  

    const mockRequest = {

      user: {

        id: 'user1',

        email: 'test@example.com'

      }

    };

  

    beforeEach(async () => {

      const module: TestingModule = await Test.createTestingModule({

        controllers: [NotificationController],

        providers: [

          {

            provide: NotificationService,

            useValue: mockNotificationService,

          },

        ],

      })

      .overrideGuard(JwtAuthGuard)

      .useValue({ canActivate: jest.fn(() => true) })

      .compile();

  

      controller = module.get<NotificationController>(NotificationController);

      service = module.get<NotificationService>(NotificationService);

  

      // Default mocks

      mockNotificationService.getUserNotifications.mockResolvedValue({

        notifications: mockNotifications,

        total: mockNotifications.length,

        page: 1,

        totalPages: 1,

        hasNext: false,

      });

      mockNotificationService.getUnreadCount.mockResolvedValue(2);

      mockNotificationService.markAsRead.mockResolvedValue({ count: 1 });

      mockNotificationService.markAllAsRead.mockResolvedValue({ count: 2 });

      mockNotificationService.getRecentNotifications.mockResolvedValue(mockNotifications);

      mockNotificationService.getNotificationsByType.mockResolvedValue({ notifications: mockNotifications });

      mockNotificationService.getNotificationById.mockResolvedValue(mockNotifications[0]);

      mockNotificationService.deleteNotification.mockResolvedValue({ count: 1 });

    });

  

    afterEach(() => {

      jest.clearAllMocks();

    });

  

    it('should be defined', () => {

      expect(controller).toBeDefined();

    });

  

    describe('getUserNotifications', () => {

      it('should return user notifications with default pagination', async () => {

        const result = await controller.getUserNotifications(mockRequest as any, undefined, 20, 1);

  

        expect(service.getUserNotifications).toHaveBeenCalledWith('user1', {

          unreadOnly: false,

          limit: 20,

          page: 1,

        });

        expect(result.success).toBe(true);

        expect(result.data.notifications).toEqual(mockNotifications);

      });

  

      it('should handle custom pagination parameters', async () => {

        await controller.getUserNotifications(mockRequest as any, 'true', 10, 2);

  

        expect(service.getUserNotifications).toHaveBeenCalledWith('user1', {

          unreadOnly: true,

          limit: 10,

          page: 2,

        });

      });

  

      it('should handle service errors gracefully', async () => {

        mockNotificationService.getUserNotifications.mockRejectedValue(new Error('Service error'));

  

        await expect(controller.getUserNotifications(mockRequest as any, undefined, 20, 1)).rejects.toThrow('Service error');

      });

    });

  

    describe('getUnreadCount', () => {

      it('should return unread notification count', async () => {

        const result = await controller.getUnreadCount(mockRequest as any);

  

        expect(service.getUnreadCount).toHaveBeenCalledWith('user1');

        expect(result.success).toBe(true);

        expect(result.data.count).toBe(2);

      });

  

      it('should return zero when no unread notifications', async () => {

        mockNotificationService.getUnreadCount.mockResolvedValue(0);

  

        const result = await controller.getUnreadCount(mockRequest as any);

  

        expect(result.data.count).toBe(0);

      });

    });

  

    describe('getRecentNotifications', () => {

      it('should return recent notifications', async () => {

        const result = await controller.getRecentNotifications(mockRequest as any);

        expect(result.data.notifications).toEqual(mockNotifications);

      });

    });

  

    describe('getNotificationsByType', () => {

      it('should return notifications by type', async () => {

        const result = await controller.getNotificationsByType(mockRequest as any, 'assignment' as any);

        expect(result.data.notifications).toEqual(mockNotifications);

      });

  

      it('should throw bad request for invalid type', async () => {

          await expect(controller.getNotificationsByType(mockRequest as any, 'invalid' as any)).rejects.toThrow('Invalid notification type');

        });

    });

  

    describe('getNotificationById', () => {

      it('should return notification by id', async () => {

        const result = await controller.getNotificationById(mockRequest as any, 'notif1');

        expect(result.data.notification).toEqual(mockNotifications[0]);

      });

    });

  

    describe('markAsRead', () => {

      it('should mark notification as read successfully', async () => {

        mockNotificationService.markAsRead.mockResolvedValue({ count: 1, message: 'Notification marked as read' });

        const result = await controller.markAsRead(mockRequest as any, 'notif1');

  

        expect(service.markAsRead).toHaveBeenCalledWith('notif1', 'user1');

        expect(result.success).toBe(true);

        expect(result.message).toBe('Notification marked as read');

        expect(result.data.count).toBe(1);

      });

  

      it('should handle notification not found', async () => {

        mockNotificationService.markAsRead.mockResolvedValue({ count: 0, message: 'Notification not found' });

  

        const result = await controller.markAsRead(mockRequest as any, 'notif999');

  

        expect(result.success).toBe(true);

        expect(result.message).toBe('Notification not found');

        expect(result.data.count).toBe(0);

      });

    });

  

    describe('markAllAsRead', () => {

      it('should mark all notifications as read', async () => {

        mockNotificationService.markAllAsRead.mockResolvedValue({ count: 2, message: 'All notifications marked as read' });

        const result = await controller.markAllAsRead(mockRequest as any);

  

        expect(service.markAllAsRead).toHaveBeenCalledWith('user1');

        expect(result.success).toBe(true);

        expect(result.message).toBe('All notifications marked as read');

        expect(result.data.count).toBe(2);

      });

  

      it('should handle when no notifications to mark as read', async () => {

        mockNotificationService.markAllAsRead.mockResolvedValue({ count: 0, message: 'All notifications marked as read' });

  

        const result = await controller.markAllAsRead(mockRequest as any);

  

        expect(result.success).toBe(true);

        expect(result.message).toBe('All notifications marked as read');

        expect(result.data.count).toBe(0);

      });

    });

  

    describe('deleteNotification', () => {

      it('should delete a notification', async () => {

        const result = await controller.deleteNotification(mockRequest as any, 'notif1');

        expect(result.data.count).toBe(1);

      });

    });

  

    describe('authentication and authorization', () => {

      it('should use user id from request for all operations', async () => {

        const differentUserRequest = {

          user: { id: 'user2' }

        };

  

        await controller.getUserNotifications(differentUserRequest as any);

        expect(service.getUserNotifications).toHaveBeenCalledWith('user2', expect.any(Object));

  

        await controller.markAsRead(differentUserRequest as any, 'notif1');

        expect(service.markAsRead).toHaveBeenCalledWith('notif1', 'user2');

  

        await controller.markAllAsRead(differentUserRequest as any);

        expect(service.markAllAsRead).toHaveBeenCalledWith('user2');

      });

    });

  

    describe('query parameter handling', () => {

      it('should convert unreadOnly string to boolean correctly', async () => {

        await controller.getUserNotifications(mockRequest as any, 'true', 20, 1);

        expect(service.getUserNotifications).toHaveBeenCalledWith('user1', {

          unreadOnly: true,

          limit: 20,

          page: 1,

        });

  

        await controller.getUserNotifications(mockRequest as any, 'false', 20, 1);

        expect(service.getUserNotifications).toHaveBeenCalledWith('user1', {

          unreadOnly: false,

          limit: 20,

          page: 1,

        });

  

        await controller.getUserNotifications(mockRequest as any, undefined, 20, 1);

        expect(service.getUserNotifications).toHaveBeenCalledWith('user1', {

          unreadOnly: false,

          limit: 20,

          page: 1,

        });

      });

    });

  

    describe('response format', () => {

      it('should return consistent success response format', async () => {

        const notificationsResult = await controller.getUserNotifications(mockRequest as any);

        expect(notificationsResult).toHaveProperty('success', true);

        expect(notificationsResult).toHaveProperty('data');

  

        const unreadCountResult = await controller.getUnreadCount(mockRequest as any);

        expect(unreadCountResult).toHaveProperty('success', true);

        expect(unreadCountResult).toHaveProperty('data');

  

        const markReadResult = await controller.markAsRead(mockRequest as any, 'notif1');

        expect(markReadResult).toHaveProperty('success', true);

        expect(markReadResult).toHaveProperty('data');

  

        const markAllReadResult = await controller.markAllAsRead(mockRequest as any);

        expect(markAllReadResult).toHaveProperty('success', true);

        expect(markAllReadResult).toHaveProperty('data');

      });

  

      it('should include appropriate messages for actions', async () => {

        const markReadResult = await controller.markAsRead(mockRequest as any, 'notif1');

        expect(markReadResult).toHaveProperty('message');

  

        const markAllReadResult = await controller.markAllAsRead(mockRequest as any);

        expect(markAllReadResult).toHaveProperty('message');

      });

    });

  });

  