// src/integration/interface/IFideProvider.ts

import { TimeControlCategory } from 'src/common/enums/time-control-category';

export interface FideRatingSnapshotData {
  tournamentName: string;
  category: TimeControlCategory;
  baseTimeSeconds: number;
  incrementSeconds: number;
  ratingBefore: number;
  ratingChange: number;
  ratingAfter: number;
  opponentRating: number;
  result: number; // 1.0 = Win, 0.5 = Draw, 0.0 = Loss
  snapshotYear: number;
  snapshotMonth: number;
  recordedAt: Date;
}

export interface FideProfileDetailsData {
  fideId: string;
  fullName: string;
  federation?: string;
  playerTitle?: string;
  classicalRating: number;
  blitzRating: number;
  rapidRating: number;
  yearOfBirth?: number;
}

export interface FideFetchedProfileData extends FideProfileDetailsData {
  ratingSnapshots: FideRatingSnapshotData[];
}

export interface IFideProvider {
  getProfileByFideId(fideId: string): Promise<FideProfileDetailsData | null>;

  getRatingSnapshotsByFideId(
    fideId: string,
    category?: TimeControlCategory,
  ): Promise<FideRatingSnapshotData[]>;

  getProfileAndSnapshotsByFideId(
    fideId: string,
  ): Promise<FideFetchedProfileData | null>;
}

export const FIDE_PROVIDER = Symbol('IFideProvider');