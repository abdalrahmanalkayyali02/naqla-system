// src/modules/users/application/user.service.ts

import { Injectable, Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AppError, Result } from 'src/common/Result';
import { PlayerType } from 'src/common/enums/player-type';
import { PlayerTitle } from 'src/common/enums/player-title';

import {
  CreateStandardPlayerDto,
  StandardPlayerResponseDto,
  FidePlayerProfileDto,
} from '../dtos/player/create-standerPlayer.dtos';
import { IUserService } from './interface/IUserService';

import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../repositories/interface/IUserReposoitory';
import {
  type IUserProfileRepository,
  USER_PROFILE_REPOSITORY,
} from '../repositories/interface/IUsersProfileReposoitory';
import {
  type IPlayerProfileRepository,
  PLAYER_PROFILE_REPOSITORY,
} from '../repositories/interface/IPlayerProfileRepository';
import {
  type IFideRatingSnapshotRepository,
  FIDE_RATING_SNAPSHOT_REPOSITORY,
} from '../repositories/interface/IFideRatingSnapshotRepository';
import {
  type IFideProvider,
  FIDE_PROVIDER,
} from 'src/integration/interface/IFideProvider';
import { PrismaService } from 'src/core/db/PrismaService';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,

    @Inject(USER_PROFILE_REPOSITORY)
    private readonly userProfileRepo: IUserProfileRepository,

    @Inject(PLAYER_PROFILE_REPOSITORY)
    private readonly playerProfileRepo: IPlayerProfileRepository,

    @Inject(FIDE_RATING_SNAPSHOT_REPOSITORY)
    private readonly ratingSnapshotRepo: IFideRatingSnapshotRepository,

    @Inject(FIDE_PROVIDER)
    private readonly fideProvider: IFideProvider,

    private readonly prisma: PrismaService,
  ) {}

  public async createStandardPlayer(
    playerData: CreateStandardPlayerDto,
  ): Promise<Result<StandardPlayerResponseDto>> {
    try {
      // 1. Uniqueness Validation (Email, Username, Phone)
      const validationResult = await this.ValidatePlayerData(playerData);
      if (validationResult.isFailure) {
        return Result.fail<StandardPlayerResponseDto>(validationResult.errors);
      }

      // 2. Determine Role (FIDE_PLAYER vs NATIONAL_PLAYER vs UNRATED_PLAYER)
      const targetRoleCode = playerData.fideId ? 'FIDE_PLAYER' : 'NATIONAL_PLAYER';
      const role = await this.prisma.role.findUnique({
        where: { code: targetRoleCode },
      });

      // 3. Parse Date of Birth safely (UTC Midnight)
      const [year, month, day] = playerData.dateOfBirth.split('-').map(Number);
      const parsedDateOfBirth = new Date(Date.UTC(year, month - 1, day));

      // 4. Create Root User Record with assigned Role
      const user = await this.userRepo.create({
        username:      playerData.username,
        email:         playerData.email,
        phoneDialCode: playerData.phoneDialCode,
        phoneNumber:   playerData.phoneNumber,
        roleId:        role?.id,
      });

      // 5. Split fullName into firstName & lastName
      const nameParts = playerData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName  = nameParts.slice(1).join(' ') || firstName;

      await this.userProfileRepo.create({
        userId:      user.id,
        firstName,
        lastName,
        gender:      playerData.gender,
        dateOfBirth: parsedDateOfBirth,
      });

      // 6. Create Player Profile (FIDE or Standard)
      let playerProfileDto: FidePlayerProfileDto | null = null;

      if (playerData.fideId) {
        // ── FIDE Player ────────────────────────────────────────────────────
        const fideResult = await this.resolveFidePlayerData(playerData.fideId);
        if (fideResult.isFailure) {
          return Result.fail<StandardPlayerResponseDto>(fideResult.errors);
        }

        const { fideData, playerType, playerTitle, ratings, federation } =
          fideResult.value;

        const yearOfBirth = fideData?.yearOfBirth ?? year;

        const playerProfileEntity = await this.playerProfileRepo.create({
          userId:          user.id,
          fullName:        fideData?.fullName ?? playerData.fullName,
          gender:          playerData.gender,
          yearOfBirth,
          fideId:          playerData.fideId,
          playerFederation: federation,
          playerType,
          playerTitle,
          classicalRating: ratings.classical,
          blitzRating:     ratings.blitz,
          rapidRating:     ratings.rapid,
        });

        // Bulk-insert historical FIDE rating snapshots
        if (fideData?.ratingSnapshots?.length) {
          await this.ratingSnapshotRepo.createMany(
            playerProfileEntity.id,
            fideData.ratingSnapshots,
          );
        }

        playerProfileDto = plainToInstance(
          FidePlayerProfileDto,
          playerProfileEntity,
          { excludeExtraneousValues: true },
        );
      } else {
        // ── Standard / Unrated Player ──────────────────────────────────────
        const playerProfileEntity = await this.playerProfileRepo.create({
          userId:          user.id,
          fullName:        playerData.fullName,
          gender:          playerData.gender,
          yearOfBirth:     year,
          playerType:      PlayerType.UNRATED,
          classicalRating: 1500,
          blitzRating:     1500,
          rapidRating:     1500,
        });

        playerProfileDto = plainToInstance(
          FidePlayerProfileDto,
          playerProfileEntity,
          { excludeExtraneousValues: true },
        );
      }

      // 7. Build Response DTO
      const rawResponse = {
        ...user,
        gender:        playerData.gender,
        dateOfBirth:   playerData.dateOfBirth,
        playerProfile: playerProfileDto,
      };

      const responseDto = plainToInstance(
        StandardPlayerResponseDto,
        rawResponse,
        { excludeExtraneousValues: true },
      );

      return Result.created<StandardPlayerResponseDto>(responseDto);
    } catch (error: any) {
      console.error(
        '[UserService.createStandardPlayer] Fatal Error:',
        error?.stack || error,
      );
      return Result.fail<StandardPlayerResponseDto>(
        AppError.failure(
          'INTERNAL_ERROR',
          'An unexpected error occurred while creating the player account.',
          'حدث خطأ غير متوقع أثناء إنشاء حساب اللاعب.',
        ),
      );
    }
  }

  // ── Private Helpers ──────────────────────────────────────────────────────

  private async ValidatePlayerData(
    playerData: CreateStandardPlayerDto,
  ): Promise<Result<void>> {
    const errors: AppError[] = [];

    const existingEmail = await this.userRepo.findByEmail?.(playerData.email);
    if (existingEmail) {
      errors.push(
        AppError.validation(
          'EMAIL_ALREADY_EXISTS',
          'Email address is already in use.',
          'البريد الإلكتروني مستخدم بالفعل.',
        ),
      );
    }

    const existingUsername = await this.userRepo.findByUsername?.(
      playerData.username,
    );
    if (existingUsername) {
      errors.push(
        AppError.validation(
          'USERNAME_ALREADY_EXISTS',
          'Username is already taken.',
          'اسم المستخدم مستخدم بالفعل.',
        ),
      );
    }

    const existingPhone = await this.userRepo.findByPhone?.(
      playerData.phoneDialCode,
      playerData.phoneNumber,
    );
    if (existingPhone) {
      errors.push(
        AppError.validation(
          'PHONE_ALREADY_EXISTS',
          'Phone number is already registered.',
          'رقم الهاتف مسجل بالفعل.',
        ),
      );
    }

    if (errors.length > 0) {
      return Result.fail(errors);
    }

    return Result.ok();
  }

  private async resolveFidePlayerData(fideId: string): Promise<
    Result<{
      fideData: any | null;
      playerType: PlayerType;
      playerTitle?: PlayerTitle;
      ratings: { classical: number; blitz: number; rapid: number };
      federation?: string;
    }>
  > {
    const fideData =
      await this.fideProvider.getProfileAndSnapshotsByFideId(fideId);

    if (!fideData) {
      return Result.fail(
        AppError.validation(
          'INVALID_FIDE_ID',
          `Invalid FIDE ID (${fideId}). Could not retrieve details from FIDE provider.`,
          `معرف FIDE غير صالح (${fideId}). لم نتمكن من جلب بيانات اللاعب.`,
        ),
      );
    }

    return Result.ok({
      fideData,
      playerType:  PlayerType.FIDE,
      playerTitle: (fideData.playerTitle as PlayerTitle) ?? undefined,
      ratings: {
        classical: fideData.classicalRating ?? 1500,
        blitz:     fideData.blitzRating     ?? 1500,
        rapid:     fideData.rapidRating     ?? 1500,
      },
      federation: fideData.federation,
    });
  }
}