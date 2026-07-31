// src/modules/ratings/infrastructure/repositories/rating-event.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/db/PrismaService';
import { TimeControlCategory } from 'src/common/enums/time-control-category';
import { CreateRatingEventData, IRatingEventRepository } from './interface/IRatingEventReposoitory';
import { IRatingEvent } from './contract/rattingEvent';

@Injectable()
export class RatingEventRepository implements IRatingEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRatingEventData): Promise<IRatingEvent> {
    return this.prisma.ratingEvent.create({
      data: {
        playerId: data.playerId,
        tournamentId: data.tournamentId,
        tournamentName: data.tournamentName,
        gameId: data.gameId,
        category: data.category,
        baseTimeSeconds: data.baseTimeSeconds,
        incrementSeconds: data.incrementSeconds,
        ratingBefore: data.ratingBefore,
        ratingChange: data.ratingChange,
        ratingAfter: data.ratingAfter,
        opponentRating: data.opponentRating,
        result: data.result,
      },
    });
  }

  async createMany(data: CreateRatingEventData[]): Promise<{ count: number }> {
    return this.prisma.ratingEvent.createMany({
      data: data.map((event) => ({
        playerId: event.playerId,
        tournamentId: event.tournamentId,
        tournamentName: event.tournamentName,
        gameId: event.gameId,
        category: event.category,
        baseTimeSeconds: event.baseTimeSeconds,
        incrementSeconds: event.incrementSeconds,
        ratingBefore: event.ratingBefore,
        ratingChange: event.ratingChange,
        ratingAfter: event.ratingAfter,
        opponentRating: event.opponentRating,
        result: event.result,
      })),
    });
  }

  async findByPlayerId(
    playerId: string,
    category?: TimeControlCategory,
  ): Promise<IRatingEvent[]> {
    return this.prisma.ratingEvent.findMany({
      where: {
        playerId,
        ...(category ? { category } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByTournamentId(tournamentId: string): Promise<IRatingEvent[]> {
    return this.prisma.ratingEvent.findMany({
      where: { tournamentId },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}