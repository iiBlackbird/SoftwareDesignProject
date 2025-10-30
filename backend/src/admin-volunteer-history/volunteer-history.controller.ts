import { Controller, Get, Param } from '@nestjs/common';
import { VolunteerHistoryService } from './volunteer-history.service';

@Controller('admin/volunteer-history')
export class VolunteerHistoryController {
  constructor(private readonly volunteerHistoryService: VolunteerHistoryService) {}

  @Get()
  async getAll() {
    return this.volunteerHistoryService.findAll();
  }

  @Get(':name')
  async getByVolunteer(@Param('name') name: string) {
    return this.volunteerHistoryService.findByVolunteer(name);
  }
}
