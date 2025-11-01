import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) {}

  // Fetch logged-in user's profile
  async getUserProfile(userId: string) {
    return this.prisma.userProfile.findUnique({
      where: { userId },
    });
  }

  // Create or update profile
  async upsertUserProfile(userId: string, data: any) {
    const {
      fullName,
      address1,
      address2,
      city,
      state,
      zip,
      skills,
      preferences,
      availability,
    } = data;

    return this.prisma.userProfile.upsert({
      where: { userId },
      update: {
        fullName,
        address1,
        address2,
        city,
        state,
        zipcode: zip,
        skills,
        preferences,
        availability: availability.map((d: string) => new Date(d)),
      },
      create: {
        userId,
        fullName,
        address1,
        address2,
        city,
        state,
        zipcode: zip,
        skills,
        preferences,
        availability: availability.map((d: string) => new Date(d)),
      },
    });
  }
}

