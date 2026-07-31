// src/modules/fide/infrastructure/adapters/lichess-fide-provider.adapter.ts

import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'; 
import { firstValueFrom } from 'rxjs';
import { TimeControlCategory } from 'src/common/enums/time-control-category';
import {
  FideFetchedProfileData,
  FideProfileDetailsData,
  FideRatingEventData,
  IFideProvider,
} from './interface/IFideProvider';

interface LichessFidePlayerResponse {
  id: number;
  name: string;
  federation?: string;
  year?: number;
  title?: string;
  standard?: number;
  rapid?: number;
  blitz?: number;
  gender?: string;
}

interface LichessFideRatingsResponse {
  standard?: number[];
  rapid?: number[];
  blitz?: number[];
}

@Injectable()
export class LichessFideProviderAdapter implements IFideProvider {
  private readonly logger = new Logger(LichessFideProviderAdapter.name);

  constructor(private readonly httpService: HttpService) {}

  async getProfileByFideId(
    fideId: string,
  ): Promise<FideProfileDetailsData | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<LichessFidePlayerResponse>(
          `https://lichess.org/api/fide/player/${fideId}`,
        ),
      );
      const profile = response.data;
      return {
        fideId: String(profile.id),
        fullName: profile.name,
        federation: profile.federation ?? undefined,
        playerTitle: profile.title ?? undefined,
        classicalRating: profile.standard ?? 1500,
        blitzRating: profile.blitz ?? 1500,
        rapidRating: profile.rapid ?? 1500,
      };
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch FIDE profile for ID ${fideId}: ${error.message}`,
      );
      return null;
    }
  }

  async getRatingEventsByFideId(
    fideId: string,
    category?: TimeControlCategory,
  ): Promise<FideRatingEventData[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<LichessFideRatingsResponse>(
          `https://lichess.org/api/fide/player/${fideId}/ratings`,
        ),
      );
      const ratings = response.data;

      const allEvents: FideRatingEventData[] = [
        ...this.parseHistoryArray(
          ratings.standard ?? [],
          TimeControlCategory.CLASSICAL,
        ),
        ...this.parseHistoryArray(
          ratings.rapid ?? [],
          TimeControlCategory.RAPID,
        ),
        ...this.parseHistoryArray(
          ratings.blitz ?? [],
          TimeControlCategory.BLITZ,
        ),
      ];

      if (category) {
        return allEvents.filter((event) => event.category === category);
      }

      return allEvents;
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch FIDE rating events for ID ${fideId}: ${error.message}`,
      );
      return [];
    }
  }

  async getProfileAndEventsByFideId(
    fideId: string,
  ): Promise<FideFetchedProfileData | null> {
    const [profile, ratingEvents] = await Promise.all([
      this.getProfileByFideId(fideId),
      this.getRatingEventsByFideId(fideId),
    ]);

    if (!profile) return null;

    return {
      ...profile,
      ratingEvents,
    };
  }

  private parseHistoryArray(
    history: number[],
    category: TimeControlCategory,
  ): FideRatingEventData[] {
    const events: FideRatingEventData[] = [];

    for (let i = 1; i < history.length; i++) {
      const prevEntry = String(history[i - 1]);
      const currEntry = String(history[i]);

      const year = currEntry.substring(0, 4);
      const month = currEntry.substring(4, 6);
      const ratingAfter = parseInt(currEntry.substring(6), 10);
      const ratingBefore = parseInt(prevEntry.substring(6), 10);
      const ratingChange = ratingAfter - ratingBefore;

      events.push({
        tournamentName: `FIDE ${category} List (${year}-${month})`,
        category,
        baseTimeSeconds:
          category === TimeControlCategory.CLASSICAL
            ? 5400
            : category === TimeControlCategory.RAPID
            ? 900
            : 180,
        incrementSeconds: category === TimeControlCategory.CLASSICAL ? 30 : 10,
        ratingBefore,
        ratingChange,
        ratingAfter,
        opponentRating: ratingBefore,
        result: ratingChange >= 0 ? 1.0 : 0.0,
      });
    }

    return events;
  }
}