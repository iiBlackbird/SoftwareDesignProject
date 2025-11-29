import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
 

@Injectable()
export class EventService {
  
  constructor(private prisma: PrismaService) {}

  

  async createEvent(createEventDto: CreateEventDto) {
    const { eventName, description, location, requiredSkills, urgency, eventDate, createdById } = createEventDto;

    try {
      const event = await this.prisma.event.create({
        data: {
          name: eventName,
          description,
          location,
          requiredSkills,
          urgency,
          eventDate: new Date(eventDate),
          createdById,
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

  async getEventsByUser(userId: string) {
    try {
      const events = await this.prisma.event.findMany({
        where: {
          createdById: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        data: events,
      };
    } catch (error) {
      throw new Error(`Failed to fetch user events: ${error.message}`);
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

  async updateEvent(id: string, updateEventDto: UpdateEventDto) {
    try {
      // First check if the event exists
      const existingEvent = await this.prisma.event.findUnique({
        where: { id },
      });

      if (!existingEvent) {
        throw new Error('Event not found');
      }

      // Prepare update data, only including fields that were provided
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (updateEventDto.eventName !== undefined) {
        updateData.name = updateEventDto.eventName;
      }
      if (updateEventDto.description !== undefined) {
        updateData.description = updateEventDto.description;
      }
      if (updateEventDto.location !== undefined) {
        updateData.location = updateEventDto.location;
      }
      if (updateEventDto.requiredSkills !== undefined) {
        updateData.requiredSkills = updateEventDto.requiredSkills;
      }
      if (updateEventDto.urgency !== undefined) {
        updateData.urgency = updateEventDto.urgency;
      }
      if (updateEventDto.eventDate !== undefined) {
        updateData.eventDate = new Date(updateEventDto.eventDate);
      }

      const updatedEvent = await this.prisma.event.update({
        where: { id },
        data: updateData,
      });

      return {
        success: true,
        message: 'Event updated successfully',
        data: updatedEvent,
      };
    } catch (error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }
  }

  async deleteEvent(id: string) {
    try {
      // First check if the event exists
      const existingEvent = await this.prisma.event.findUnique({
        where: { id },
      });

      if (!existingEvent) {
        throw new Error('Event not found');
      }

      // Delete the event
      await this.prisma.event.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Event deleted successfully',
      };
    } catch (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  }
}