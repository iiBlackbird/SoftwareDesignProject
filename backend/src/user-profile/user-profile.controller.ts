import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Req, 
  UseGuards, 
  BadRequestException 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserProfileService } from './user-profile.service';
import { UpsertUserProfileDto } from './dto/upsert-user-profile.dto';

@Controller('user/profile')
export class UserProfileController {
  constructor(private readonly profileService: UserProfileService) {}

  // Get the logged-in user's profile
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getProfile(@Req() req: any) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User must be logged in.');
    }

    const userId = req.user.id;
    return await this.profileService.getUserProfile(userId);
  }

  // Create or update user profile
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async upsertProfile(
    @Req() req: any, 
    @Body() body: UpsertUserProfileDto 
  ) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User must be logged in.');
    }

    const userId = req.user.id;
    return await this.profileService.upsertUserProfile(userId, body);
  }
}
