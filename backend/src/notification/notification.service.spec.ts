import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from './dto/create-notification.dto';

describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: PrismaService;

  const mockNotifications = [
    { 
      id: 'notif1', 
      type: NotificationType.ASSIGNMENT, 
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
      type: NotificationType.REMINDER, 
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

  const mockUserProfiles = [
    { userId: 'user1', skills: ['First Aid']},
    { userId: 'user2', skills: ['Medical'] },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: {
            notification: { 
              create: jest.fn(),
              createMany: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              count: jest.fn(),
              updateMany: jest.fn(),
            },
            userProfile: { 
              findMany: jest.fn() 
            },
          },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prisma = module.get<PrismaService>(PrismaService);

    // Default mocks
    (prisma.notification.findMany as jest.Mock).mockResolvedValue(mockNotifications);
    (prisma.notification.count as jest.Mock).mockResolvedValue(mockNotifications.length);
    (prisma.notification.create as jest.Mock).mockImplementation(async ({ data }) => ({
      id: 'new-notif',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    (prisma.notification.createMany as jest.Mock).mockResolvedValue({ count: 2 });
    (prisma.notification.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
    (prisma.userProfile.findMany as jest.Mock).mockResolvedValue(mockUserProfiles);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNotification', () => {
    it('should create a notification successfully', async () => {
      const notificationData = {
        type: NotificationType.ASSIGNMENT,
        title: 'Test Notification',
        message: 'Test message',
        time: '2023-10-25T10:30:00Z',
        read: false,
        userId: 'user1',
        eventId: 'event1',
      };

      const result = await service.createNotification(notificationData);

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: notificationData,
      });
      expect(result).toHaveProperty('id');
      expect(result.type).toBe(NotificationType.ASSIGNMENT);
    });

    it('should handle creation errors', async () => {
      const notificationData = {
        type: NotificationType.ASSIGNMENT,
        title: 'Test Notification',
        message: 'Test message',
        time: '2023-10-25T10:30:00Z',
        userId: 'user1',
      };

      (prisma.notification.create as jest.Mock).mockRejectedValue(new Error('Database error'));

       await expect(service.createNotification(notificationData)).rejects.toThrow('Failed to create notification: Database error');
    });
  });

  describe('getUserNotifications', () => {
    it('should return user notifications with pagination', async () => {
      const userId = 'user1';
      const result = await service.getUserNotifications(userId, { page: 1, limit: 10 });

      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        skip: 0,
      });
      expect(prisma.notification.count).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result.notifications).toEqual(mockNotifications);
      expect(result.total).toBe(mockNotifications.length);
      expect(result.page).toBe(1);
    });

    it('should return only unread notifications when unreadOnly is true', async () => {
      const userId = 'user1';
      await service.getUserNotifications(userId, { unreadOnly: true, page: 1, limit: 10 });

      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        where: { userId, read: false },
        orderBy: { createdAt: 'desc' },
        take: 10,
        skip: 0,
      });
    });

    it('should handle empty notifications', async () => {
      const userId = 'user3';
      (prisma.notification.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.notification.count as jest.Mock).mockResolvedValue(0);

      const result = await service.getUserNotifications(userId);

      expect(result.notifications).toHaveLength(0);
      expect(result.total).toBe(0);
    });
    
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const notificationId = 'notif1';
      const userId = 'user1';

      const result = await service.markAsRead(notificationId, userId);

      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: {
          id: notificationId,
          userId: userId,
        },
        data: {
          read: true,
        },
      });
      expect(result.count).toBe(1);
    });

    it('should handle marking non-existent notification', async () => {
      const notificationId = 'notif999';
      const userId = 'user1';
      (prisma.notification.updateMany as jest.Mock).mockResolvedValue({ count: 0 });

      const result = await service.markAsRead(notificationId, userId);

      expect(result.count).toBe(0);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read for user', async () => {
      const userId = 'user1';

      const result = await service.markAllAsRead(userId);

      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: {
          userId,
          read: false,
        },
        data: {
          read: true,
        },
      });
      expect(result.count).toBe(1);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread notification count', async () => {
      const userId = 'user1';
      (prisma.notification.count as jest.Mock).mockResolvedValue(3);

      const result = await service.getUnreadCount(userId);

      expect(prisma.notification.count).toHaveBeenCalledWith({
        where: {
          userId,
          read: false,
        },
      });
      expect(result).toBe(3);
    });
  });

  describe('notifyVolunteersOfNewEvent', () => {
    it('should create notifications for matching volunteers', async () => {
      const event = {
        id: 'event1',
        name: 'Blood Drive',
        requiredSkills: ['First Aid', 'Medical'],
      };

      await service.notifyVolunteersOfNewEvent(event);

      expect(prisma.userProfile.findMany).toHaveBeenCalledWith({
        where: {
          skills: {
            hasSome: event.requiredSkills,
          },
          
        },
        select: {
          userId: true,
        },
      });
      expect(prisma.notification.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            type: NotificationType.ASSIGNMENT,
            title: 'New Event Matches Your Skills!',
            message: 'The event "Blood Drive" is looking for volunteers with skills like yours.',
            read: false,
            userId: 'user1',
            eventId: 'event1',
          }),
        ]),
      });
    });

    it('should not create notifications when no matching volunteers found', async () => {
      const event = {
        id: 'event1',
        name: 'Blood Drive',
        requiredSkills: ['RareSkill'],
      };

      (prisma.userProfile.findMany as jest.Mock).mockResolvedValue([]);

      await service.notifyVolunteersOfNewEvent(event);

      expect(prisma.userProfile.findMany).toHaveBeenCalled();
      expect(prisma.notification.createMany).not.toHaveBeenCalled();
    });
  });

  describe('sendEventUpdateNotification', () => {
    it('should send update notifications to specified users', async () => {
      const event = { id: 'event1', name: 'Blood Drive' };
      const userIds = ['user1', 'user2'];

      await service.sendEventUpdateNotification(event, userIds);

      expect(prisma.notification.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            type: NotificationType.UPDATE,
            title: 'Event Updated',
            message: 'The event "Blood Drive" has been updated. Please review the changes.',
            read: false,
            userId: 'user1',
            eventId: 'event1',
          }),
        ]),
      });
    });
  });

  describe('sendReminderNotification', () => {
    it('should send reminder notifications to specified users', async () => {
      const event = { 
        id: 'event1', 
        name: 'Blood Drive', 
        date: new Date() 
      };
      const userIds = ['user1', 'user2'];

      await service.sendReminderNotification(event, userIds);

      expect(prisma.notification.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            type: NotificationType.REMINDER,
            title: 'Event Reminder',
            message: 'Reminder: The event "Blood Drive" is coming up soon!',
            read: false,
            userId: 'user1',
            eventId: 'event1',
          }),
        ]),
      });
    });
  });

  describe('getNotificationById', () => {
    it('should return notification when found', async () => {
      const notificationId = 'notif1';
      const userId = 'user1';
      const mockNotification = {
        ...mockNotifications[0],
        user: { id: 'user1', email: 'test@test.com', fullName: 'Test User' },
        event: { id: 'event1', name: 'Test Event', eventDate: new Date() },
      };

      (prisma.notification.findFirst as jest.Mock).mockResolvedValue(mockNotification);

      const result = await service.getNotificationById(notificationId, userId);

      expect(prisma.notification.findFirst).toHaveBeenCalledWith({
        where: {
          id: notificationId,
          userId: userId,
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
      expect(result).toEqual(mockNotification);
    });

    it('should return null when notification not found', async () => {
      const notificationId = 'notif999';
      const userId = 'user1';
      (prisma.notification.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await service.getNotificationById(notificationId, userId);

      expect(result).toBeNull();
    });
  });
});