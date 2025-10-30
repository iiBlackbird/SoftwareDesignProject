import { Controller, Get, Query, ValidationPipe, BadRequestException } from '@nestjs/common';
import { UserVolunteerHistoryService } from './user-volunteer-history.service';
import { GetUserHistoryDto } from './dto/get-user-history.dto';

@Controller('user/volunteer-history')
export class UserVolunteerHistoryController {
  constructor(private readonly historyService: UserVolunteerHistoryService) {}

  @Get()
  async getUserHistory(
    @Query(new ValidationPipe({ transform: true }))
    query: GetUserHistoryDto,
  ) {
    const userId = query.userId;
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    return await this.historyService.getUserHistory(userId); 
  }


}

