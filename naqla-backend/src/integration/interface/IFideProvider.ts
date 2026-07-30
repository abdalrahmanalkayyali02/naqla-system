// src/modules/fide/domain/adapters/fide-provider.interface.ts

// src/modules/fide/domain/entities/fide-player-data.entity.ts

export interface FideRatingEventData {
  tournamentName: string;
  category: 'BULLET' | 'BLITZ' | 'RAPID' | 'CLASSICAL';
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


export interface IFideProvider {
  /**
   * Fetches profile details and rating events by FIDE ID.
   */
  getProfileAndEventsByFideId(fideId: string): Promise<FideFetchedProfileData | null>;
}

export const FIDE_PROVIDER = Symbol('IFideProvider');