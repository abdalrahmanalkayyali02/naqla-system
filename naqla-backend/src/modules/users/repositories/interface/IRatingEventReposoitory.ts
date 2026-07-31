// src/modules/ratings/domain/repositories/rating-event.repository.interface.ts

import { TimeControlCategory } from 'src/common/enums/time-control-category';
import { IRatingEvent } from '../contract/rattingEvent';

export interface CreateRatingEventData {
  playerId: string;
  tournamentId?: string;
  tournamentName: string;
  gameId?: string;
  category: TimeControlCategory;
  baseTimeSeconds: number;
  incrementSeconds: number;
  ratingBefore: number;
  ratingChange: number;
  ratingAfter: number;
  opponentRating: number;
  result: number; // 1.0 (Win), 0.5 (Draw), 0.0 (Loss)
}

export interface IRatingEventRepository {
  /**
   * Records a new rating change event for a player.
   */
  create(data: CreateRatingEventData): Promise<IRatingEvent>;

  /**
   * Batch creates multiple rating events (used when syncing external historical FIDE events).
   */
  createMany(data: CreateRatingEventData[]): Promise<{ count: number }>;

  /**
   * Retrieves all rating events for a specific player, optionally filtered by category.
   */
  findByPlayerId(
    playerId: string,
    category?: TimeControlCategory,
  ): Promise<IRatingEvent[]>;

  /**
   * Finds rating events tied to a specific tournament.
   */
  findByTournamentId(tournamentId: string): Promise<IRatingEvent[]>;
}

export const RATING_EVENT_REPOSITORY = Symbol('IRatingEventRepository');