// src/modules/users/dtos/player/create-standerPlayer.dtos.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Gender } from 'src/common/enums/user-gender';

export class CreateStandardPlayerDto {
  @ApiProperty({ example: 'kasparov' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: 'garry.kasparov@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: '+962' })
  @IsString()
  @IsNotEmpty()
  phoneDialCode!: string;

  @ApiProperty({ example: '791234567' })
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @ApiProperty({ example: 'Garry Kasparov' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: '1963-04-13' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateOfBirth must be formatted strictly as YYYY-MM-DD',
  })
  dateOfBirth!: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender!: Gender;

  @ApiPropertyOptional({ example: '4100018' })
  @IsString()
  @IsOptional()
  fideId?: string;
}

// ==========================================
// PROFILES (Standard vs FIDE)
// ==========================================

export class StandardPlayerProfileDto {
  @ApiProperty({ example: 'a4e332b8-bf00-4e66-910d-a89a36dbb438' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'Garry Kasparov' })
  @Expose()
  fullName!: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @Expose()
  gender!: Gender;

  @ApiProperty({ example: '1963-04-13T00:00:00.000Z' })
  @Expose()
  dateOfBirth!: Date;

  @ApiProperty({ example: 'UNRATED' })
  @Expose()
  playerType!: string;
}

export class FidePlayerProfileDto extends StandardPlayerProfileDto {
  @ApiProperty({ example: '4100018' })
  @Expose()
  fideId!: string;

  @ApiPropertyOptional({ example: 'RUS' })
  @Expose()
  playerFederation?: string;

  @ApiPropertyOptional({ example: 'GM' })
  @Expose()
  playerTitle?: string;

  @ApiProperty({ example: 2812 })
  @Expose()
  classicalRating!: number;

  @ApiProperty({ example: 2712 })
  @Expose()
  blitzRating!: number;

  @ApiProperty({ example: 2783 })
  @Expose()
  rapidRating!: number;
}

// ==========================================
// MAIN RESPONSE DTO
// ==========================================

export class StandardPlayerResponseDto {
  @ApiProperty({ example: '9e640a4e-e4cd-4785-a7c5-02c5e1fd82cd' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'kasparov' })
  @Expose({ name: 'userName' }) // Maps domain `userName` to `username`
  username!: string;

  @ApiProperty({ example: 'garry.kasparov@example.com' })
  @Expose()
  email!: string;

  @ApiPropertyOptional({ example: '+962' })
  @Expose({ name: 'phoneNumber_dialCode' })
  phoneDialCode?: string;

  @ApiPropertyOptional({ example: '791234567' })
  @Expose({ name: 'phoeneNumber' })
  phoneNumber?: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @Expose()
  gender!: Gender;

  @ApiProperty({ example: '1963-04-13T00:00:00.000Z' })
  @Expose()
  dateOfBirth!: Date;

  @ApiPropertyOptional({
    description: 'Present only when player has FIDE rating data',
  })
  @Expose()
  playerProfile?: FidePlayerProfileDto | StandardPlayerProfileDto;
}