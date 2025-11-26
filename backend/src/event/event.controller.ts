import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpStatus, HttpException } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    try {
      const result = await this.eventService.createEvent(createEventDto);
      return {
        statusCode: HttpStatus.CREATED,
        ...result,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async getAllEvents(@Query('userId') userId?: string) {
    try {
      let result;
      if (userId) {
        result = await this.eventService.getEventsByUser(userId);
      } else {
        result = await this.eventService.getAllEvents();
      }
      return {
        statusCode: HttpStatus.OK,
        ...result,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getEventById(@Param('id') id: string) {
    try {
      const result = await this.eventService.getEventById(id);
      return {
        statusCode: HttpStatus.OK,
        ...result,
      };
    } catch (error) {
      const statusCode = error.message.includes('not found') 
        ? HttpStatus.NOT_FOUND 
        : HttpStatus.INTERNAL_SERVER_ERROR;
      
      throw new HttpException(
        {
          statusCode,
          message: error.message,
          error: statusCode === HttpStatus.NOT_FOUND ? 'Not Found' : 'Internal Server Error',
        },
        statusCode,
      );
    }
  }

  @Put(':id')
  async updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    try {
      const result = await this.eventService.updateEvent(id, updateEventDto);
      return {
        statusCode: HttpStatus.OK,
        ...result,
      };
    } catch (error) {
      const statusCode = error.message.includes('not found') 
        ? HttpStatus.NOT_FOUND 
        : HttpStatus.BAD_REQUEST;
      
      throw new HttpException(
        {
          statusCode,
          message: error.message,
          error: statusCode === HttpStatus.NOT_FOUND ? 'Not Found' : 'Bad Request',
        },
        statusCode,
      );
    }
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    try {
      const result = await this.eventService.deleteEvent(id);
      return {
        statusCode: HttpStatus.OK,
        ...result,
      };
    } catch (error) {
      const statusCode = error.message.includes('not found') 
        ? HttpStatus.NOT_FOUND 
        : HttpStatus.INTERNAL_SERVER_ERROR;
      
      throw new HttpException(
        {
          statusCode,
          message: error.message,
          error: statusCode === HttpStatus.NOT_FOUND ? 'Not Found' : 'Internal Server Error',
        },
        statusCode,
      );
    }
  }
}