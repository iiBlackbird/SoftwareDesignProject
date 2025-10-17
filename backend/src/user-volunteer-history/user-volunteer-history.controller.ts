// backend/src/user-volunteer-history/user-volunteer-history.controller.ts
import { Controller, Get, Req } from '@nestjs/common';
import { UserVolunteerHistoryService } from './user-volunteer-history.service';
import type { Request } from 'express';

@Controller('user/volunteer-history')
export class UserVolunteerHistoryController {
    constructor(private readonly historyService: UserVolunteerHistoryService) {}

    @Get()
    getUserHistory(@Req() req: Request) {
        // hardcoded userId = 1 
        const userId = 1;
        return this.historyService.getUserHistory(userId);
    }
}
