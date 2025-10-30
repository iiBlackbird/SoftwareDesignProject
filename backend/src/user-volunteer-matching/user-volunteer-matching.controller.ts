import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { UserVolunteerMatchingService } from './user-volunteer-matching.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user/volunteer-matching')
export class UserVolunteerMatchingController {
  constructor(private readonly matchingService: UserVolunteerMatchingService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMatchedEvents(@Req() req: any) {
    const userId = req.user.id; // from JWT
    return this.matchingService.getMatchedEventsForUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('enroll')
  async enrollInEvent(@Req() req: any, @Body() body: { eventId: string }) {
    const userId = req.user.id; // from JWT
    return this.matchingService.enrollInEvent(userId, body.eventId);
  }
}

