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
  });
});