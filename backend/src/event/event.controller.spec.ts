import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { CreateEventDto, EventUrgency } from './dto/create-event.dto';
import { HttpStatus } from '@nestjs/common';

describe('EventController', () => {
  let controller: EventController;
  let service: EventService;

  const mockEventService = {
    createEvent: jest.fn(),
    getAllEvents: jest.fn(),
    getEventById: jest.fn(),
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
  });
});