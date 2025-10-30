import { Controller, Get, Patch, Query, Body, Req } from '@nestjs/common';
import { UserVolunteerMatchingService } from './user-volunteer-matching.service';
import { GetUserMatchesDto } from './dto/get-user-matches.dto';

@Controller('user/volunteer-matching')
export class UserVolunteerMatchingController {
  constructor(private readonly matchingService: UserVolunteerMatchingService) {}

  // GET /user/volunteer-matching?userId=123
  @Get()
  async getMatchedEvents(@Query('userId') userId: string) {
    return this.matchingService.getMatchedEventsForUser(userId);
  }

  // PATCH /user/volunteer-matching/enroll
  // body: { userId: "123", eventId: "abc" }
  @Patch('enroll')
  async enrollInEvent(@Body() body: { userId: string; eventId: string }) {
    return this.matchingService.enrollInEvent(body.userId, body.eventId);
  }
}
