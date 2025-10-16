import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { UserVolunteerMatchingService } from './user-volunteer-matching.service';

@Controller('user/volunteer-matching')
export class UserVolunteerMatchingController {
  constructor(private readonly matchingService: UserVolunteerMatchingService) {}

  @Get()
  getUserMatches(@Req() req: Request) {
    // Mock logged-in user - when db is integrated, will get this from auth token/session
    const userId = 1;
    return this.matchingService.getUserMatches(userId);
  }
}
