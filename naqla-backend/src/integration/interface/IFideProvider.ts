// src/modules/fide/domain/adapters/fide-provider.interface.ts

import { TimeControlCategory } from "src/common/enums/time-control-category";

// src/modules/fide/domain/entities/fide-player-data.entity.ts

export interface FideRatingEventData {
  tournamentName: string;
  category: TimeControlCategory;
  baseTimeSeconds: number;
  incrementSeconds: number;
  ratingBefore: number;
  ratingChange: number;
  ratingAfter: number;
  opponentRating: number;
  result: number; // 1.0, 0.5, 0.0
}

export interface FideFetchedProfileData {
  fideId: string;
  fullName: string;
  federation?: string;
  playerTitle?: string;
  classicalRating: number;
  blitzRating: number;
  rapidRating: number;
  ratingEvents: FideRatingEventData[];
}


export interface FideRatingEventData {
  tournamentName: string;
  category: TimeControlCategory;
  baseTimeSeconds: number;
  incrementSeconds: number;
  ratingBefore: number;
  ratingChange: number;
  ratingAfter: number;
  opponentRating: number;
  result: number; // 1.0 = Win, 0.5 = Draw, 0.0 = Loss
}

export interface FideProfileDetailsData {
  fideId: string;
  fullName: string;
  federation?: string;
  playerTitle?: string;
  classicalRating: number;
  blitzRating: number;
  rapidRating: number;
}

export interface FideFetchedProfileData extends FideProfileDetailsData {
  ratingEvents: FideRatingEventData[];
}


export interface IFideProvider {
  /**
   * Fetches only profile details (Title, Country Federation, Snapshot Ratings) by FIDE ID.
   */
  getProfileByFideId(fideId: string): Promise<FideProfileDetailsData | null>;

  /**
   * Fetches only historical rating events/changes by FIDE ID.
   * Optionally filtered by category (CLASSICAL, RAPID, BLITZ).
   */
  getRatingEventsByFideId(
    fideId: string,
    category?: TimeControlCategory,
  ): Promise<FideRatingEventData[]>;

  /**
   * Fetches combined profile details AND historical rating events by FIDE ID.
   */
  getProfileAndEventsByFideId(fideId: string): Promise<FideFetchedProfileData | null>;
}

export const FIDE_PROVIDER = Symbol('IFideProvider');