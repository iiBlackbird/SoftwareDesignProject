import { Controller, Get, Param } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { VolunteerHistoryService } from './volunteer-history.service';
import { GetVolunteerHistoryDto } from './dto/get-volunteer-history.dto';

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
  getByVolunteer(@Param('name', new ValidationPipe({ transform: true })) name: string) {
    // The ValidationPipe will ensure 'name' is a non-empty string
    return this.volunteerHistoryService.findByVolunteer(name);
  }
}