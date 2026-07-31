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
  type IRatingEventRepository,
  RATING_EVENT_REPOSITORY,
} from '../repositories/interface/IRatingEventReposoitory';
import {
  type IFideProvider,
  FIDE_PROVIDER,
} from 'src/integration/interface/IFideProvider';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,

    @Inject(USER_PROFILE_REPOSITORY)
    private readonly userProfileRepo: IUserProfileRepository,

    @Inject(PLAYER_PROFILE_REPOSITORY)
    private readonly playerProfileRepo: IPlayerProfileRepository,

    @Inject(RATING_EVENT_REPOSITORY)
    private readonly ratingEventRepo: IRatingEventRepository,

    @Inject(FIDE_PROVIDER)
    private readonly fideProvider: IFideProvider,
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

      // 2. Parse Date of Birth safely (UTC Midnight)
      const [year, month, day] = playerData.dateOfBirth.split('-').map(Number);
      const parsedDateOfBirth = new Date(Date.UTC(year, month - 1, day));

      // 3. Create Root User Record
      const user = await this.userRepo.create({
        username: playerData.username,
        email: playerData.email,
        phoneDialCode: playerData.phoneDialCode,
        phoneNumber: playerData.phoneNumber,
      });

      // 4. Split fullName into firstName & lastName for User Profile
      const nameParts = playerData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || firstName;

      await this.userProfileRepo.create({
        userId: user.id,
        firstName,
        lastName,
        username: playerData.username,
        email: playerData.email,
        phoneNumber: playerData.phoneNumber,
        phoneNumber_dialCode: playerData.phoneDialCode,
        gender: playerData.gender,
        dateOfBirth: parsedDateOfBirth,
      });

      // 5. Conditionally Create Player Profile (ONLY IF FIDE ID EXISTS)
      let playerProfileDto: FidePlayerProfileDto | null = null;

      if (playerData.fideId) {
        // Resolve FIDE Data from Provider
        const fideResult = await this.resolveFidePlayerData(playerData.fideId);
        if (fideResult.isFailure) {
          return Result.fail<StandardPlayerResponseDto>(fideResult.errors);
        }

        const { fideData, playerType, playerTitle, ratings, federation } =
          fideResult.value;

        // Save PlayerProfile record in DB
        const playerProfileEntity = await this.playerProfileRepo.create({
          userId: user.id,
          fullName: fideData?.fullName ?? playerData.fullName,
          gender: playerData.gender,
          dateOfBirth: parsedDateOfBirth,
          fideId: playerData.fideId,
          playerFederation: federation,
          playerType,
          playerTitle,
          classicalRating: ratings.classical,
          blitzRating: ratings.blitz,
          rapidRating: ratings.rapid,
        });

        // Record Historical Rating Events
        if (fideData?.ratingEvents?.length) {
          await this.ratingEventRepo.createMany(
            fideData.ratingEvents.map((event: any) => ({
              ...event,
              playerId: playerProfileEntity.id,
            })),
          );
        }

        playerProfileDto = plainToInstance(
          FidePlayerProfileDto,
          playerProfileEntity,
          { excludeExtraneousValues: true },
        );
      }

      // 6. Build Root Response Payload
      const rawResponse = {
        ...user,
        gender: playerData.gender,
        dateOfBirth: playerData.dateOfBirth, // Retains YYYY-MM-DD
        playerProfile: playerProfileDto, // null if unrated, populated if FIDE
      };

      const responseDto = plainToInstance(
        StandardPlayerResponseDto,
        rawResponse,
        { excludeExtraneousValues: true },
      );

      return Result.created<StandardPlayerResponseDto>(responseDto);
    } catch (error) {
      console.error('[UserService.createStandardPlayer] Error:', error);
      return Result.fail<StandardPlayerResponseDto>(
        AppError.failure(
          'INTERNAL_ERROR',
          'An unexpected error occurred while creating the player account.',
          'حدث خطأ غير متوقع أثناء إنشاء حساب اللاعب.',
        ),
      );
    }
  }

  /**
   * Helper method to validate unique email, username, and phone number.
   */
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

  /**
   * Helper method to resolve FIDE profiles and ratings.
   */
  private async resolveFidePlayerData(fideId: string): Promise<
    Result<{
      fideData: any | null;
      playerType: PlayerType;
      playerTitle?: PlayerTitle;
      ratings: { classical: number; blitz: number; rapid: number };
      federation?: string;
    }>
  > {
    const fideData = await this.fideProvider.getProfileAndEventsByFideId(fideId);

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