// src/modules/ratings/infrastructure/repositories/interface/IFideRatingSnapshotRepository.ts

import { TimeControlCategory } from 'src/common/enums/time-control-category';
import { IFideRatingSnapshot } from 'src/core/db/contracts/fideRatingSnapshot';

export interface CreateFideRatingSnapshotData {
  playerId: string;
  category: TimeControlCategory;
  tournamentName: string;
  baseTimeSeconds: number;
  incrementSeconds: number;
  ratingBefore: number;
  ratingChange: number;
  ratingAfter: number;
  opponentRating: number;
  result: number;
  snapshotYear: number;
  snapshotMonth: number;
  recordedAt: Date;
}

export interface IFideRatingSnapshotRepository {
  create(data: CreateFideRatingSnapshotData): Promise<IFideRatingSnapshot>;
  createMany(
    playerId: string,
    snapshots: Omit<CreateFideRatingSnapshotData, 'playerId'>[],
  ): Promise<{ count: number }>;
  findByPlayerId(
    playerId: string,
    category?: TimeControlCategory,
  ): Promise<IFideRatingSnapshot[]>;
}

export const FIDE_RATING_SNAPSHOT_REPOSITORY = Symbol('IFideRatingSnapshotRepository');