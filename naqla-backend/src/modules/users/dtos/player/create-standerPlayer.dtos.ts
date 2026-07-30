import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { Gender } from 'src/common/enums/user-gender';


export class CreateStandardPlayerDto {
  // --- Account Credentials / Details ---
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phoneDialCode!: string; // e.g., "+962"

  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  // --- Personal Profile Details ---
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender!: Gender;

  // --- Optional Attributes ---
  @IsString()
  @IsOptional()
  fideId?: string;
}

// src/modules/players/dto/player-response.dto.ts


export class PlayerProfileResponseDto {
  @Expose()
  id!: string;

  @Expose()
  fullName!: string;

  @Expose()
  gender!: Gender;

  @Expose()
  fideId?: string;

  @Expose()
  playerFederation?: string;

  @Expose()
  playerType!: string; // FIDE or UNRATED

  @Expose()
  playerTitle?: string;

  @Expose()
  classicalRating!: number;

  @Expose()
  blitzRating!: number;

  @Expose()
  rapidRating!: number;
}

export class StandardPlayerResponseDto {
  @Expose()
  id!: string;

  @Expose()
  username!: string;

  @Expose()
  email!: string;

  @Expose()
  phoneDialCode?: string;

  @Expose()
  phoneNumber?: string;

  @Expose()
  isEmailVerified!: boolean;

  @Expose()
  isPhoneNumberVerified!: boolean;

  @Expose()
  status!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  @Type(() => PlayerProfileResponseDto)
  playerProfile!: PlayerProfileResponseDto;
}