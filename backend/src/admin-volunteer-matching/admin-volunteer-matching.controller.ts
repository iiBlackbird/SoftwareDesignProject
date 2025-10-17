import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminVolunteerMatchingService } from './admin-volunteer-matching.service';
//import { SuggestedMatchDto, AssignVolunteerResponseDto } from './dto';
import { SuggestedMatchDto } from './dto/suggested-match.dto';
import { AssignVolunteerResponseDto } from './dto/assign-volunteer-response.dto';
import { AssignVolunteerDto } from './dto/assign-volunteer.dto';

@Controller('admin/volunteer-matching')
export class AdminVolunteerMatchingController {
    constructor(private readonly matchingService: AdminVolunteerMatchingService) {}

    @Get()
    getMatches(): SuggestedMatchDto[] {
        return this.matchingService.getSuggestedMatches();
    }

    @Post('assign')
    assignVolunteer(
        @Body() body: AssignVolunteerDto,
    ): AssignVolunteerResponseDto {
        return this.matchingService.assignVolunteerToEvent(body.volunteerId, body.eventId);
    }
}
