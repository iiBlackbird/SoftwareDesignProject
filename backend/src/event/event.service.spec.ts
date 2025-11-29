import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, EventUrgency } from './dto/create-event.dto';

describe('EventService', () => {
  let service: EventService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    event: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEvent', () => {
    it('should create an event successfully', async () => {
      const createEventDto: CreateEventDto = {
        eventName: 'Test Event',
        description: 'Test Description',
        location: 'Test Location',
        requiredSkills: ['Event Planning', 'Fundraising'],
        urgency: EventUrgency.NORMAL,
        eventDate: '2024-12-01',
      };

      const mockEvent = {
        id: '1',
        name: 'Test Event',
        description: 'Test Description',
        location: 'Test Location',
        requiredSkills: ['Event Planning', 'Fundraising'],
        urgency: 'Normal',
        eventDate: new Date('2024-12-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.event.create.mockResolvedValue(mockEvent);

      const result = await service.createEvent(createEventDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Event created successfully');
      expect(result.data).toEqual(mockEvent);
      expect(mockPrismaService.event.create).toHaveBeenCalledWith({
        data: {
          name: createEventDto.eventName,
          description: createEventDto.description,
          location: createEventDto.location,
          requiredSkills: createEventDto.requiredSkills,
          urgency: createEventDto.urgency,
          eventDate: new Date(createEventDto.eventDate),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw an error if event creation fails', async () => {
      const createEventDto: CreateEventDto = {
        eventName: 'Test Event',
        description: 'Test Description',
        location: 'Test Location',
        requiredSkills: ['Event Planning', 'Fundraising'],
        urgency: EventUrgency.NORMAL,
        eventDate: '2024-12-01',
      };

      mockPrismaService.event.create.mockRejectedValue(new Error('Test error'));

      await expect(service.createEvent(createEventDto)).rejects.toThrow('Failed to create event: Test error');
    });
  });

  describe('getAllEvents', () => {
    it('should return all events', async () => {
      const mockEvents = [
        { id: '1', name: 'Event 1' },
        { id: '2', name: 'Event 2' },
      ];
      mockPrismaService.event.findMany.mockResolvedValue(mockEvents);

      const result = await service.getAllEvents();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockEvents);
      expect(mockPrismaService.event.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should throw an error if fetching events fails', async () => {
      mockPrismaService.event.findMany.mockRejectedValue(new Error('Test error'));

      await expect(service.getAllEvents()).rejects.toThrow('Failed to fetch events: Test error');
    });
  });

  describe('getEventsByUser', () => {
    it('should return events for a specific user', async () => {
      const userId = 'user1';
      const mockEvents = [
        { id: '1', name: 'Event 1', createdById: userId },
        { id: '2', name: 'Event 2', createdById: userId },
      ];
      mockPrismaService.event.findMany.mockResolvedValue(mockEvents);

      const result = await service.getEventsByUser(userId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockEvents);
      expect(mockPrismaService.event.findMany).toHaveBeenCalledWith({
        where: {
          createdById: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should throw an error if fetching user events fails', async () => {
      const userId = 'user1';
      mockPrismaService.event.findMany.mockRejectedValue(new Error('Test error'));

      await expect(service.getEventsByUser(userId)).rejects.toThrow('Failed to fetch user events: Test error');
    });
  });

  describe('getEventById', () => {
    it('should return an event by id', async () => {
      const eventId = '1';
      const mockEvent = { id: eventId, name: 'Event 1' };
      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);

      const result = await service.getEventById(eventId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockEvent);
      expect(mockPrismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: eventId },
      });
    });

    it('should throw an error if event not found', async () => {
      const eventId = 'non-existent-id';
      mockPrismaService.event.findUnique.mockResolvedValue(null);

      await expect(service.getEventById(eventId)).rejects.toThrow('Failed to fetch event: Event not found');
    });

    it('should throw an error if fetching event by id fails', async () => {
        const eventId = '1';
        mockPrismaService.event.findUnique.mockRejectedValue(new Error('Test error'));
  
        await expect(service.getEventById(eventId)).rejects.toThrow('Failed to fetch event: Test error');
      });
  });

  describe('updateEvent', () => {
    it('should update an event successfully', async () => {
      const eventId = '1';
      const updateEventDto = {
        eventName: 'Updated Event',
        description: 'Updated Description',
        urgency: EventUrgency.HIGH,
      };

      const existingEvent = {
        id: eventId,
        name: 'Original Event',
        description: 'Original Description',
        location: 'Original Location',
        requiredSkills: ['Event Planning'],
        urgency: 'Normal',
        eventDate: new Date('2024-12-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedEvent = {
        ...existingEvent,
        name: 'Updated Event',
        description: 'Updated Description',
        urgency: 'High',
        updatedAt: new Date(),
      };

      mockPrismaService.event.findUnique.mockResolvedValue(existingEvent);
      mockPrismaService.event.update.mockResolvedValue(updatedEvent);

      const result = await service.updateEvent(eventId, updateEventDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Event updated successfully');
      expect(result.data).toEqual(updatedEvent);
      expect(mockPrismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: eventId },
      });
      expect(mockPrismaService.event.update).toHaveBeenCalledWith({
        where: { id: eventId },
        data: {
          name: updateEventDto.eventName,
          description: updateEventDto.description,
          urgency: updateEventDto.urgency,
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw error when event not found', async () => {
      const eventId = 'non-existent-id';
      const updateEventDto = {
        eventName: 'Updated Event',
      };

      mockPrismaService.event.findUnique.mockResolvedValue(null);

      await expect(service.updateEvent(eventId, updateEventDto)).rejects.toThrow('Failed to update event: Event not found');
    });

    it('should throw an error if updating event fails', async () => {
        const eventId = '1';
        const updateEventDto = {
          eventName: 'Updated Event',
        };
  
        mockPrismaService.event.findUnique.mockResolvedValue({ id: eventId });
        mockPrismaService.event.update.mockRejectedValue(new Error('Test error'));
  
        await expect(service.updateEvent(eventId, updateEventDto)).rejects.toThrow('Failed to update event: Test error');
      });
  });

  describe('deleteEvent', () => {
    it('should delete an event successfully', async () => {
      const eventId = '1';
      const mockEvent = { id: eventId, name: 'Event 1' };
      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
      mockPrismaService.event.delete.mockResolvedValue(mockEvent);

      const result = await service.deleteEvent(eventId);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Event deleted successfully');
      expect(mockPrismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: eventId },
      });
      expect(mockPrismaService.event.delete).toHaveBeenCalledWith({
        where: { id: eventId },
      });
    });

    it('should throw an error if event not found', async () => {
      const eventId = 'non-existent-id';
      mockPrismaService.event.findUnique.mockResolvedValue(null);

      await expect(service.deleteEvent(eventId)).rejects.toThrow('Failed to delete event: Event not found');
    });

    it('should throw an error if deleting event fails', async () => {
        const eventId = '1';
        mockPrismaService.event.findUnique.mockResolvedValue({ id: eventId });
        mockPrismaService.event.delete.mockRejectedValue(new Error('Test error'));
  
        await expect(service.deleteEvent(eventId)).rejects.toThrow('Failed to delete event: Test error');
      });
  });
});