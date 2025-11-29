import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { CreateEventDto, EventUrgency } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { HttpStatus, HttpException } from '@nestjs/common';

describe('EventController', () => {
  let controller: EventController;
  let service: EventService;

  const mockEventService = {
    createEvent: jest.fn(),
    getAllEvents: jest.fn(),
    getEventsByUser: jest.fn(),
    getEventById: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService,
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
    service = module.get<EventService>(EventService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createEvent', () => {
    it('should create an event successfully', async () => {
      const createEventDto: CreateEventDto = {
        eventName: 'Test Event',
        description: 'Test Description',
        location: 'Test Location',
        requiredSkills: ['Event Planning'],
        urgency: EventUrgency.NORMAL,
        eventDate: '2024-12-01',
      };

      const mockResult = {
        success: true,
        message: 'Event created successfully',
        data: { id: '1', ...createEventDto },
      };

      mockEventService.createEvent.mockResolvedValue(mockResult);

      const result = await controller.createEvent(createEventDto);

      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(result.success).toBe(true);
      expect(mockEventService.createEvent).toHaveBeenCalledWith(createEventDto);
    });

    it('should handle event creation failure', async () => {
      const createEventDto: CreateEventDto = {
        eventName: 'Test Event',
        description: 'Test Description',
        location: 'Test Location',
        requiredSkills: ['Event Planning'],
        urgency: EventUrgency.NORMAL,
        eventDate: '2024-12-01',
      };

      const errorMessage = 'Failed to create event';
      mockEventService.createEvent.mockRejectedValue(new Error(errorMessage));

      await expect(controller.createEvent(createEventDto)).rejects.toThrow(
        new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: errorMessage,
            error: 'Bad Request',
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('getAllEvents', () => {
    it('should get all events when no userId is provided', async () => {
      const mockEvents = [{ id: '1', name: 'Event 1' }];
      mockEventService.getAllEvents.mockResolvedValue({
        success: true,
        data: mockEvents,
      });

      const result = await controller.getAllEvents();

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockEvents);
      expect(mockEventService.getAllEvents).toHaveBeenCalled();
    });

    it('should get events by user when userId is provided', async () => {
      const userId = 'user1';
      const mockEvents = [{ id: '1', name: 'Event 1', createdById: userId }];
      mockEventService.getEventsByUser.mockResolvedValue({
        success: true,
        data: mockEvents,
      });

      const result = await controller.getAllEvents(userId);

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockEvents);
      expect(mockEventService.getEventsByUser).toHaveBeenCalledWith(userId);
    });

    it('should handle errors during event fetching', async () => {
      const errorMessage = 'Failed to fetch events';
      mockEventService.getAllEvents.mockRejectedValue(new Error(errorMessage));

      await expect(controller.getAllEvents()).rejects.toThrow(
        new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: errorMessage,
            error: 'Internal Server Error',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('getEventById', () => {
    it('should get an event by id', async () => {
      const eventId = '1';
      const mockEvent = { id: eventId, name: 'Event 1' };
      mockEventService.getEventById.mockResolvedValue({
        success: true,
        data: mockEvent,
      });

      const result = await controller.getEventById(eventId);

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockEvent);
      expect(mockEventService.getEventById).toHaveBeenCalledWith(eventId);
    });

    it('should handle event not found', async () => {
      const eventId = 'non-existent-id';
      const errorMessage = 'Event not found';
      mockEventService.getEventById.mockRejectedValue(new Error(errorMessage));

      await expect(controller.getEventById(eventId)).rejects.toThrow(
        new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: errorMessage,
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('updateEvent', () => {
    it('should update an event successfully', async () => {
      const eventId = '1';
      const updateEventDto: UpdateEventDto = {
        eventName: 'Updated Event',
        description: 'Updated Description',
        urgency: EventUrgency.HIGH,
      };

      const mockResult = {
        success: true,
        message: 'Event updated successfully',
        data: { id: eventId, ...updateEventDto },
      };

      mockEventService.updateEvent.mockResolvedValue(mockResult);

      const result = await controller.updateEvent(eventId, updateEventDto);

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Event updated successfully');
      expect(mockEventService.updateEvent).toHaveBeenCalledWith(eventId, updateEventDto);
    });

    it('should handle update failure for non-existent event', async () => {
      const eventId = 'non-existent-id';
      const updateEventDto: UpdateEventDto = { eventName: 'Updated Name' };
      const errorMessage = 'Event not found';
      mockEventService.updateEvent.mockRejectedValue(new Error(errorMessage));

      await expect(controller.updateEvent(eventId, updateEventDto)).rejects.toThrow(
        new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: errorMessage,
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event successfully', async () => {
      const eventId = '1';
      const mockResult = {
        success: true,
        message: 'Event deleted successfully',
      };
      mockEventService.deleteEvent.mockResolvedValue(mockResult);

      const result = await controller.deleteEvent(eventId);

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Event deleted successfully');
      expect(mockEventService.deleteEvent).toHaveBeenCalledWith(eventId);
    });

    it('should handle delete failure for non-existent event', async () => {
      const eventId = 'non-existent-id';
      const errorMessage = 'Event not found';
      mockEventService.deleteEvent.mockRejectedValue(new Error(errorMessage));

      await expect(controller.deleteEvent(eventId)).rejects.toThrow(
        new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: errorMessage,
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });
});