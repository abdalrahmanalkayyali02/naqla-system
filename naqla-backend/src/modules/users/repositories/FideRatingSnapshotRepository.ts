// src/modules/users/repositories/FideRatingSnapshotRepository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/db/PrismaService';
import { TimeControlCategory } from 'src/common/enums/time-control-category';
import {
  CreateFideRatingSnapshotData,
  IFideRatingSnapshotRepository,
} from '../interface/Repo/IFideRatingSnapshotRepository';
import { IFideRatingSnapshot } from 'src/core/db/contracts/fideRatingSnapshot';

@Injectable()
export class FideRatingSnapshotRepository implements IFideRatingSnapshotRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFideRatingSnapshotData): Promise<IFideRatingSnapshot> {
    return this.prisma.fideRatingSnapshot.create({
      data: {
        playerId:        data.playerId,
        category:        data.category as any,
        tournamentName:  data.tournamentName,
        baseTimeSeconds: data.baseTimeSeconds,
        incrementSeconds: data.incrementSeconds,
        ratingBefore:    data.ratingBefore,
        ratingChange:    data.ratingChange,
        ratingAfter:     data.ratingAfter,
        opponentRating:  data.opponentRating,
        result:          data.result,
        snapshotYear:    data.snapshotYear,
        snapshotMonth:   data.snapshotMonth,
        recordedAt:      data.recordedAt,
      },
    }) as unknown as IFideRatingSnapshot;
  }

  /**
   * Bulk-inserts rating snapshots for a given player.
   * Matches the service call: createMany(playerId, snapshots[])
   */
  async createMany(
    playerId: string,
    snapshots: Omit<CreateFideRatingSnapshotData, 'playerId'>[],
  ): Promise<{ count: number }> {
    return this.prisma.fideRatingSnapshot.createMany({
      data: snapshots.map((s) => ({
        playerId,
        category:        s.category as any,
        tournamentName:  s.tournamentName,
        baseTimeSeconds: s.baseTimeSeconds,
        incrementSeconds: s.incrementSeconds,
        ratingBefore:    s.ratingBefore,
        ratingChange:    s.ratingChange,
        ratingAfter:     s.ratingAfter,
        opponentRating:  s.opponentRating,
        result:          s.result,
        snapshotYear:    s.snapshotYear,
        snapshotMonth:   s.snapshotMonth,
        recordedAt:      s.recordedAt,
      })),
    });
  }

  async findByPlayerId(
    playerId: string,
    category?: TimeControlCategory,
  ): Promise<IFideRatingSnapshot[]> {
    return this.prisma.fideRatingSnapshot.findMany({
      where: {
        playerId,
        ...(category ? { category: category as any } : {}),
      },
      orderBy: [{ snapshotYear: 'desc' }, { snapshotMonth: 'desc' }],
    }) as unknown as IFideRatingSnapshot[];
  }
}