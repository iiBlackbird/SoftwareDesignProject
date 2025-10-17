import { Controller, Get, Query, Req } from '@nestjs/common';
import { UserVolunteerMatchingService } from './user-volunteer-matching.service';
import { GetUserMatchesDto } from './dto/get-user-matches.dto';

@Controller('user/volunteer-matching')
export class UserVolunteerMatchingController {
    constructor(private readonly matchingService: UserVolunteerMatchingService) {}
    
    @Get()
        getUserMatches(@Query() query: GetUserMatchesDto) {
        // use hardcoded userId for now 
        const userId = query.userId ?? 1; 
        return this.matchingService.getUserMatches(userId);
        }
}
