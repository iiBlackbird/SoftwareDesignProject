import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminVolunteerMatchingService } from './admin-volunteer-matching.service';
import { SuggestedMatchDto, AssignVolunteerResponseDto } from './dto';

@Controller('admin/volunteer-matching')
export class AdminVolunteerMatchingController {
    constructor(private readonly matchingService: AdminVolunteerMatchingService) {}

    @Get()
    getMatches(): SuggestedMatchDto[] {
        return this.matchingService.getSuggestedMatches();
    }

    @Post('assign')
    assignVolunteer(
        @Body() body: { volunteerId: number; eventId: number },
    ): AssignVolunteerResponseDto {
        return this.matchingService.assignVolunteerToEvent(body.volunteerId, body.eventId);
    }
}
