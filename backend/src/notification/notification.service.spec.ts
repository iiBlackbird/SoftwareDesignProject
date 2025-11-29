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
                            delete: jest.fn(),
                            deleteMany: jest.fn(),
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
              
                describe('createBulkNotifications', () => {
                  it('should throw an error if bulk creation fails', async () => {
                    const notificationsData = [
                      {
                        type: NotificationType.ASSIGNMENT,
                        title: 'Test Notification',
                        message: 'Test message',
                        time: '2023-10-25T10:30:00Z',
                        userId: 'user1',
                      },
                    ];
                    (prisma.notification.createMany as jest.Mock).mockRejectedValue(new Error('Test error'));
              
                    await expect(service.createBulkNotifications(notificationsData)).rejects.toThrow('Test error');
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
                    });
                    expect(prisma.notification.count).toHaveBeenCalledWith({
                      where: { userId },
                    });
                    expect(result.notifications.length).toBe(mockNotifications.length);
                    expect(result.notifications[0]).toHaveProperty('id');
                    expect(result.notifications[0]).toHaveProperty('type');
                    expect(result.notifications[0]).toHaveProperty('title');
                    expect(result.notifications[0]).toHaveProperty('message');
                    expect(result.notifications[0]).toHaveProperty('time');
                    expect(result.notifications[0]).toHaveProperty('read');
                    expect(result.notifications[0]).toHaveProperty('userId');
                    expect(result.notifications[0]).toHaveProperty('eventId');
                    expect(result.notifications[0]).toHaveProperty('createdAt');
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
              
                  it('should throw an error if fetching notifications fails', async () => {
                    const userId = 'user1';
                    (prisma.notification.findMany as jest.Mock).mockRejectedValue(new Error('Test error'));
              
                    await expect(service.getUserNotifications(userId)).rejects.toThrow('Test error');
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
              
                    await expect(service.markAsRead(notificationId, userId)).rejects.toThrow('Notification not found or access denied');
                  });
              
                  it('should throw an error if marking as read fails', async () => {
                    const notificationId = 'notif1';
                    const userId = 'user1';
                    (prisma.notification.updateMany as jest.Mock).mockRejectedValue(new Error('Test error'));
              
                    await expect(service.markAsRead(notificationId, userId)).rejects.toThrow('Test error');
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
              
                  it('should throw an error if marking all as read fails', async () => {
                    const userId = 'user1';
                    (prisma.notification.updateMany as jest.Mock).mockRejectedValue(new Error('Test error'));
              
                    await expect(service.markAllAsRead(userId)).rejects.toThrow('Test error');
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
              
                  it('should throw an error if getting unread count fails', async () => {
                    const userId = 'user1';
                    (prisma.notification.count as jest.Mock).mockRejectedValue(new Error('Test error'));
              
                    await expect(service.getUnreadCount(userId)).rejects.toThrow('Test error');
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
              
                  it('should throw an error if notifying volunteers fails', async () => {
                    const event = {
                      id: 'event1',
                      name: 'Blood Drive',
                      requiredSkills: ['First Aid', 'Medical'],
                    };
                    (prisma.userProfile.findMany as jest.Mock).mockRejectedValue(new Error('Test error'));
              
                    await expect(service.notifyVolunteersOfNewEvent(event)).rejects.toThrow('Test error');
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
              
                  it('should throw an error if sending event update notifications fails', async () => {
                    const event = { id: 'event1', name: 'Blood Drive' };
                    const userIds = ['user1', 'user2'];
                    (prisma.notification.createMany as jest.Mock).mockRejectedValue(new Error('Test error'));
              
                    await expect(service.sendEventUpdateNotification(event, userIds)).rejects.toThrow('Test error');
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
              
                  it('should throw an error if sending reminder notifications fails', async () => {
                    const event = { 
                      id: 'event1', 
                      name: 'Blood Drive', 
                      date: new Date() 
                    };
                    const userIds = ['user1', 'user2'];
                    (prisma.notification.createMany as jest.Mock).mockRejectedValue(new Error('Test error'));
              
                    await expect(service.sendReminderNotification(event, userIds)).rejects.toThrow('Test error');
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
                            location: true,
                            description: true,
                          },
                        },
                      },
                    });
                    expect(result).toEqual(mockNotification);
                  });
              
                  it('should throw not found exception when notification not found', async () => {
                    const notificationId = 'notif999';
                    const userId = 'user1';
                    (prisma.notification.findFirst as jest.Mock).mockResolvedValue(null);
              
                    await expect(service.getNotificationById(notificationId, userId)).rejects.toThrow('Notification not found');
                  });
              
                  it('should throw an error if getting notification by id fails', async () => {
                    const notificationId = 'notif1';
                    const userId = 'user1';
                    (prisma.notification.findFirst as jest.Mock).mockRejectedValue(new Error('Test error'));
              
                    await expect(service.getNotificationById(notificationId, userId)).rejects.toThrow('Test error');
                  });
                });
              
                describe('getNotificationsByType', () => {
                  it('should return notifications by type', async () => {
                    const userId = 'user1';
                    const type = NotificationType.ASSIGNMENT;
                    await service.getNotificationsByType(userId, type);
              
                    expect(prisma.notification.findMany).toHaveBeenCalledWith({
                      where: { userId, type },
                      take: 20,
                      skip: 0,
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
                  });
              
                  it('should throw an error if getting notifications by type fails', async () => {
                    const userId = 'user1';
                    const type = NotificationType.ASSIGNMENT;
                    (prisma.notification.findMany as jest.Mock).mockRejectedValue(new Error('Test error'));
              
                    await expect(service.getNotificationsByType(userId, type)).rejects.toThrow('Test error');
                  });
                });
              
                describe('getRecentNotifications', () => {
                  it('should return recent notifications', async () => {
                    const userId = 'user1';
                    await service.getRecentNotifications(userId);
              
                    expect(prisma.notification.findMany).toHaveBeenCalledWith({
                      where: {
                        userId,
                        createdAt: {
                          gte: expect.any(Date),
                        },
                      },
                      take: 10,
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
                  });
              
                  it('should throw an error if getting recent notifications fails', async () => {
                    const userId = 'user1';
                    (prisma.notification.findMany as jest.Mock).mockRejectedValue(new Error('Test error'));
              
                    await expect(service.getRecentNotifications(userId)).rejects.toThrow('Test error');
                  });
                });
              
                describe('deleteNotification', () => {
                  it('should delete a notification', async () => {
                    const notificationId = 'notif1';
                    const userId = 'user1';
                    (prisma.notification.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });
              
                    await service.deleteNotification(notificationId, userId);
              
                    expect(prisma.notification.deleteMany).toHaveBeenCalledWith({
                      where: {
                        id: notificationId,
                        userId,
                      },
                    });
                  });
              
                  it('should throw not found when deleting non-existent notification', async () => {
                    const notificationId = 'notif999';
                    const userId = 'user1';
                    (prisma.notification.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });
              
                    await expect(service.deleteNotification(notificationId, userId)).rejects.toThrow('Notification not found or access denied');
                  });
              
                  it('should throw an error if deleting notification fails', async () => {
                    const notificationId = 'notif1';
                    const userId = 'user1';
                    (prisma.notification.deleteMany as jest.Mock).mockRejectedValue(new Error('Test error'));
              
                    await expect(service.deleteNotification(notificationId, userId)).rejects.toThrow('Test error');
                  });
                });
              
                describe('createEventSignupNotification', () => {
                  it('should create a notification for event signup', async () => {
                    const userId = 'user1';
                    const event = { id: 'event1', name: 'Test Event' };
                    await service.createEventSignupNotification(userId, event);
              
                    expect(prisma.notification.create).toHaveBeenCalledWith({
                      data: {
                        type: NotificationType.ASSIGNMENT,
                        title: 'Volunteer Assignment Confirmed',
                        message: `You have successfully signed up for "${event.name}"!`,
                        time: expect.any(String),
                        read: false,
                        userId,
                        eventId: event.id,
                      },
                    });
                  });
              
                  it('should throw an error if creating event signup notification fails', async () => {
                    const userId = 'user1';
                    const event = { id: 'event1', name: 'Test Event' };
                    (prisma.notification.create as jest.Mock).mockRejectedValue(new Error('Test error'));
              
                    await expect(service.createEventSignupNotification(userId, event)).rejects.toThrow('Failed to create notification: Test error');
                  });
                });
              });
              