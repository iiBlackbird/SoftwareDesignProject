import { Controller, Get, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserVolunteerHistoryService } from './user-volunteer-history.service';

@Controller('user/volunteer-history')
export class UserVolunteerHistoryController {
  constructor(private readonly historyService: UserVolunteerHistoryService) {}

  @UseGuards(AuthGuard('jwt')) // use JWT guard
  @Get()
  async getUserHistory(@Req() req: any) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('userId is required');
    }
    const userId = req.user.id; // comes from JwtStrategy validate()
    return await this.historyService.getUserHistory(userId);
  }
}


