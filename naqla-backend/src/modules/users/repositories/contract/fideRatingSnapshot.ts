// src/modules/users/repositories/contract/fideRatingSnapshot.ts

import { TimeControlCategory } from 'src/common/enums/time-control-category';

export interface IFideRatingSnapshot {
  id: string;
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