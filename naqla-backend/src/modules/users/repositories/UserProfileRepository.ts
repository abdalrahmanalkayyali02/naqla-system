// src/modules/users/infrastructure/repositories/user-profile.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/db/PrismaService';
import { CreateUserProfileData, IUserProfileRepository, UpdateUserProfileData } from './interface/IUsersProfileReposoitory';
import { IUserProfile } from './contract/UserProfile';


@Injectable()
export class UserProfileRepository implements IUserProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserProfileData): Promise<IUserProfile> {
    const result = await this.prisma.userProfile.create({
      data: {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: (data.gender ?? null) as any,
        dateOfBirth: data.dateOfBirth ?? null,
      },
    });
    return result as unknown as IUserProfile;
  }

  async findByUserId(userId: string): Promise<IUserProfile | null> {
    const result = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    return result as unknown as IUserProfile | null;
  }

  async updateByUserId(
    userId: string,
    data: UpdateUserProfileData,
  ): Promise<IUserProfile> {
    const result = await this.prisma.userProfile.update({
      where: { userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: (data.gender ?? null) as any,
        dateOfBirth: data.dateOfBirth ?? null,
      },
    });
    return result as unknown as IUserProfile;
  }
}