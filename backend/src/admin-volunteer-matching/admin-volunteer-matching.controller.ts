import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminVolunteerMatchingService } from './admin-volunteer-matching.service';
import { SuggestedMatchDto } from './dto/suggested-match.dto';
import { AssignVolunteerResponseDto } from './dto/assign-volunteer-response.dto';
import { AssignVolunteerDto } from './dto/assign-volunteer.dto';

@Controller('admin/volunteer-matching')
export class AdminVolunteerMatchingController {
  constructor(private readonly matchingService: AdminVolunteerMatchingService) {}

  @Get()
  async getMatches(): Promise<SuggestedMatchDto[]> {
    return await this.matchingService.getSuggestedMatches();
  }

  // ADD THIS ENDPOINT
  @Get('events')
  async getEvents() {
    return await this.matchingService.getAllEvents();
  }

  @Post('assign')
  async assignVolunteer(
    @Body() body: AssignVolunteerDto,
  ): Promise<AssignVolunteerResponseDto> {
    return await this.matchingService.assignVolunteerToEvent(
      body.volunteerId,
      body.eventId,
    );
  }
}