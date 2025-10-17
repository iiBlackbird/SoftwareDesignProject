import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { UserVolunteerHistoryService } from './user-volunteer-history.service';
import { GetUserHistoryDto } from './dto/get-user-history.dto';

@Controller('user/volunteer-history')
export class UserVolunteerHistoryController {
  constructor(private readonly historyService: UserVolunteerHistoryService) {}

  @Get()
  getUserHistory(
    @Query(new ValidationPipe({ transform: true }))
    query: GetUserHistoryDto,
  ) {
    // Use the query userId if provided, otherwise default to 1
    const userId = query.userId ?? 1;
    return this.historyService.getUserHistory(userId);
  }
}
