// src/modules/fide/infrastructure/adapters/lichess-fide-provider.adapter.ts

import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { TimeControlCategory } from 'src/common/enums/time-control-category';
import {
  IFideProvider,
  FideProfileDetailsData,
  FideRatingSnapshotData,
  FideFetchedProfileData,
} from 'src/integration/interface/IFideProvider';

interface LichessFidePlayerResponse {
  id: number;
  name: string;
  federation?: string;
  year?: number;
  title?: string;
  standard?: number;
  rapid?: number;
  blitz?: number;
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
        yearOfBirth: profile.year ?? undefined,
      };
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch FIDE profile for ID ${fideId}: ${error.message}`,
      );
      return null;
    }
  }

  async getRatingSnapshotsByFideId(
    fideId: string,
    category?: TimeControlCategory,
  ): Promise<FideRatingSnapshotData[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<LichessFideRatingsResponse>(
          `https://lichess.org/api/fide/player/${fideId}/ratings`,
        ),
      );
      const ratings = response.data;

      const allSnapshots: FideRatingSnapshotData[] = [
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
        return allSnapshots.filter((s) => s.category === category);
      }

      return allSnapshots;
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch FIDE rating snapshots for ID ${fideId}: ${error.message}`,
      );
      return [];
    }
  }

  async getProfileAndSnapshotsByFideId(
    fideId: string,
  ): Promise<FideFetchedProfileData | null> {
    const [profile, ratingSnapshots] = await Promise.all([
      this.getProfileByFideId(fideId),
      this.getRatingSnapshotsByFideId(fideId),
    ]);

    if (!profile) return null;

    return {
      ...profile,
      ratingSnapshots,
    };
  }

  private parseHistoryArray(
    history: number[],
    category: TimeControlCategory,
  ): FideRatingSnapshotData[] {
    const snapshots: FideRatingSnapshotData[] = [];

    for (let i = 1; i < history.length; i++) {
      const prevEntry = String(history[i - 1]);
      const currEntry = String(history[i]);

      if (currEntry.length < 7 || prevEntry.length < 7) continue;

      const year = parseInt(currEntry.substring(0, 4), 10);
      const month = parseInt(currEntry.substring(4, 6), 10);
      const ratingAfter = parseInt(currEntry.substring(6), 10);
      const ratingBefore = parseInt(prevEntry.substring(6), 10);

      if (isNaN(year) || isNaN(month) || isNaN(ratingAfter) || isNaN(ratingBefore)) {
        continue;
      }

      const ratingChange = ratingAfter - ratingBefore;

      snapshots.push({
        tournamentName: `FIDE ${category} List (${year}-${String(month).padStart(2, '0')})`,
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
        snapshotYear: year,
        snapshotMonth: month,
        recordedAt: new Date(Date.UTC(year, month - 1, 1)),
      });
    }

    return snapshots;
  }
}