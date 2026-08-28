import { Injectable } from '@nestjs/common';
import {
  CreatePlayerProfileData,
  IPlayerProfileRepository,
  UpdatePlayerProfileData,
  UpdateRatingsData,
} from '../interface/Repo/IPlayerProfileRepository';
import { PrismaService } from 'src/core/db/PrismaService';
import { IPlayerProfile } from 'src/core/db/contracts/playerProfile';

@Injectable()
export class PlayerProfileRepository implements IPlayerProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePlayerProfileData): Promise<IPlayerProfile> {
    const result = await this.prisma.playerProfile.create({
      data: {
        userId: data.userId,
        fullName: data.fullName,
        gender: data.gender as any,
        fideId: data.fideId,
        playerFederation: data.playerFederation,
        playerType: data.playerType as any,
        playerTitle: data.playerTitle as any,
        classicalRating: data.classicalRating ?? 0,
        blitzRating: data.blitzRating ?? 0,
        rapidRating: data.rapidRating ?? 0,
        yearOfBirth: data.yearOfBirth, // Updated: matches schema model
      },
    });
    return result as unknown as IPlayerProfile;
  }

  async findById(id: string): Promise<IPlayerProfile | null> {
    const result = await this.prisma.playerProfile.findUnique({
      where: { id },
    });
    return result as unknown as IPlayerProfile | null;
  }

  async findByUserId(userId: string): Promise<IPlayerProfile | null> {
    const result = await this.prisma.playerProfile.findUnique({
      where: { userId },
    });
    return result as unknown as IPlayerProfile | null;
  }

  async findByFideId(fideId: string): Promise<IPlayerProfile | null> {
    const result = await this.prisma.playerProfile.findFirst({
      where: { fideId },
    });
    return result as unknown as IPlayerProfile | null;
  }

  async updateByUserId(
    userId: string,
    data: UpdatePlayerProfileData,
  ): Promise<IPlayerProfile> {
    const result = await this.prisma.playerProfile.update({
      where: { userId },
      data: {
        fullName: data.fullName,
        gender: data.gender as any,
        fideId: data.fideId,
        playerFederation: data.playerFederation,
        playerType: data.playerType as any,
        playerTitle: data.playerTitle as any,
        classicalRating: data.classicalRating,
        blitzRating: data.blitzRating,
        rapidRating: data.rapidRating,
        yearOfBirth: data.yearOfBirth, // Updated: matches schema model
      },
    });
    return result as unknown as IPlayerProfile;
  }

  async updateRatings(
    playerId: string,
    ratings: UpdateRatingsData,
  ): Promise<IPlayerProfile> {
    const result = await this.prisma.playerProfile.update({
      where: { id: playerId },
      data: {
        classicalRating: ratings.classicalRating,
        blitzRating: ratings.blitzRating,
        rapidRating: ratings.rapidRating,
      },
    });
    return result as unknown as IPlayerProfile;
  }
}