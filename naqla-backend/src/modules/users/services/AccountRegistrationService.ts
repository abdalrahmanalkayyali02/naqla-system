// src/modules/users/application/services/account-registration.service.ts

import { Injectable, Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AppError, Result } from 'src/common/Result';
import { PlayerType } from 'src/common/enums/player-type';
import { PlayerTitle } from 'src/common/enums/player-title';
import { auth } from 'src/common/lib/auth';

import {
  type IFideProvider,
  FIDE_PROVIDER,
} from 'src/integration/interface/IFideProvider';
import { PrismaService } from 'src/core/db/PrismaService';
import { CreateStandardPlayerDto, StandardPlayerResponseDto, FidePlayerProfileDto } from '../dtos/player/create-standerPlayer.dtos';
import { FIDE_RATING_SNAPSHOT_REPOSITORY, type IFideRatingSnapshotRepository } from '../repositories/interface/IFideRatingSnapshotRepository';
import { PLAYER_PROFILE_REPOSITORY, type IPlayerProfileRepository } from '../repositories/interface/IPlayerProfileRepository';
import { USER_REPOSITORY, type IUserRepository } from '../repositories/interface/IUserReposoitory';
import { USER_PROFILE_REPOSITORY, type IUserProfileRepository } from '../repositories/interface/IUsersProfileReposoitory';
import { IAccountRegistrationService } from './interface/IAccountRegistrationService';


@Injectable()
export class AccountRegistrationService implements IAccountRegistrationService {
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
      const validationResult = await this.validatePlayerData(playerData);
      if (validationResult.isFailure) {
        return Result.fail<StandardPlayerResponseDto>(validationResult.errors);
      }

      // 2. Determine Role (FIDE_PLAYER vs NATIONAL_PLAYER)
      const targetRoleCode = playerData.fideId ? 'FIDE_PLAYER' : 'NATIONAL_PLAYER';
      const role = await this.prisma.role.findUnique({
        where: { code: targetRoleCode },
      });

      // 3. Create Credentials & Auth User Record via Better Auth
      const authUser = await auth.api.signUpEmail({
        body: {
          email: playerData.email,
          password: playerData.password,
          name: playerData.username,
        },
      });

      if (!authUser || !authUser.user) {
        return Result.fail<StandardPlayerResponseDto>(
          AppError.failure(
            'AUTH_CREATION_FAILED',
            'Failed to create authentication credentials.',
            'فشل إنشاء بيانات الاعتماد والحساب الأساسي.',
          ),
        );
      }

      const createdUserId = authUser.user.id;

      // 4. Update Created User with domain attributes (Phone & Assigned Role)
      const user = await this.userRepo.update(createdUserId, {
        username: playerData.username,
        phoneDialCode: playerData.phoneDialCode,
        phoneNumber: playerData.phoneNumber,
        roleId: role?.id,
      });

      // 5. Parse Date of Birth safely & Create UserProfile
      const [year, month, day] = playerData.dateOfBirth.split('-').map(Number);
      const parsedDateOfBirth = new Date(Date.UTC(year, month - 1, day));

      const nameParts = playerData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || firstName;

      await this.userProfileRepo.create({
        userId: createdUserId,
        firstName,
        lastName,
        gender: playerData.gender,
        dateOfBirth: parsedDateOfBirth,
      });

      // 6. Create Player Profile (FIDE or Standard Unrated)
      let playerProfileDto: FidePlayerProfileDto | null = null;

      if (playerData.fideId) {
        // ── FIDE Registered Player ─────────────────────────────────────────
        const fideResult = await this.resolveFidePlayerData(playerData.fideId);
        if (fideResult.isFailure) {
          return Result.fail<StandardPlayerResponseDto>(fideResult.errors);
        }

        const { fideData, playerType, playerTitle, ratings, federation } =
          fideResult.value;

        const yearOfBirth = fideData?.yearOfBirth ?? year;

        const playerProfileEntity = await this.playerProfileRepo.create({
          userId: createdUserId,
          fullName: fideData?.fullName ?? playerData.fullName,
          gender: playerData.gender,
          yearOfBirth,
          fideId: playerData.fideId,
          playerFederation: federation,
          playerType,
          playerTitle,
          classicalRating: ratings.classical,
          blitzRating: ratings.blitz,
          rapidRating: ratings.rapid,
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
          userId: createdUserId,
          fullName: playerData.fullName,
          gender: playerData.gender,
          yearOfBirth: year,
          playerType: PlayerType.UNRATED,
          classicalRating: 1500,
          blitzRating: 1500,
          rapidRating: 1500,
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
        gender: playerData.gender,
        dateOfBirth: playerData.dateOfBirth,
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
        '[AccountRegistrationService.createStandardPlayer] Fatal Error:',
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

  private async validatePlayerData(
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
      playerType: PlayerType.FIDE,
      playerTitle: (fideData.playerTitle as PlayerTitle) ?? undefined,
      ratings: {
        classical: fideData.classicalRating ?? 0,
        blitz: fideData.blitzRating ?? 0,
        rapid: fideData.rapidRating ?? 0,
      },
      federation: fideData.federation,
    });
  }
}