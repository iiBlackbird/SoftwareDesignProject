import { Controller, Get } from '@nestjs/common';
import { AdminEventsService } from './admin-events.service';

@Controller('admin/events')
export class AdminEventsController {
  constructor(private readonly eventsService: AdminEventsService) {}

  @Get('upcoming')
  async getUpcomingEvents() {
    return this.eventsService.getUpcomingEvents();
  }
}
