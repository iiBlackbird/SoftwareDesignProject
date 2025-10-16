import { Controller, Get, Param } from '@nestjs/common';
import { VolunteerHistoryService } from './volunteer-history.service'

@Controller('admin/volunteer-history')
export class VolunteerHistoryController {
  constructor(private readonly volunteerHistoryService: VolunteerHistoryService) {}

  // GET /admin/volunteer-history
  @Get()
  getAll() {
    return this.volunteerHistoryService.findAll();
  }

  // GET /admin/volunteer-history/:name
  @Get(':name')
  getByVolunteer(@Param('name') name: string) {
    return this.volunteerHistoryService.findByVolunteer(name);
  }
}