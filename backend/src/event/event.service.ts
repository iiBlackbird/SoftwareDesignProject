import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async createEvent(createEventDto: CreateEventDto) {
    const { eventName, description, location, requiredSkills, urgency, eventDate } = createEventDto;

    try {
      const event = await this.prisma.event.create({
        data: {
          name: eventName,
          description,
          location,
          requiredSkills,
          urgency,
          eventDate: new Date(eventDate),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Event created successfully',
        data: event,
      };
    } catch (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }
  }

  async getAllEvents() {
    try {
      const events = await this.prisma.event.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        data: events,
      };
    } catch (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  }

  async getEventById(id: string) {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id },
      });

      if (!event) {
        throw new Error('Event not found');
      }

      return {
        success: true,
        data: event,
      };
    } catch (error) {
      throw new Error(`Failed to fetch event: ${error.message}`);
    }
  }
}