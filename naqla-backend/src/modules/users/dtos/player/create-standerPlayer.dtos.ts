// src/modules/users/dtos/player/create-standerPlayer.dtos.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { Gender } from '../../../../common/enums/user-gender';

// Helper function لترتيب كائن الرسالة Bilingual
const msg = (en: string, ar: string) => JSON.stringify({ en, ar });

// ==========================================
// REQUEST DTO
// ==========================================

export class CreateStandardPlayerDto {
  @ApiProperty({ example: 'kasparov' })
  @IsString({ message: msg('Username must be a string', 'اسم المستخدم يجب أن يكون نصاً') })
  @IsNotEmpty({ message: msg('Username is required', 'اسم المستخدم مطلوب ولا يمكن أن يكون فارغاً') })
  username!: string;

  @ApiProperty({ example: 'garry.kasparov@example.com' })
  @IsEmail({}, { message: msg('Invalid email address format', 'صيغة البريد الإلكتروني غير صالحة') })
  @IsNotEmpty({ message: msg('Email is required', 'البريد الإلكتروني مطلوب ولا يمكن أن يكون فارغاً') })
  email!: string;

  @ApiProperty({ example: 'P@ssword123!', description: 'Minimum 8 characters' })
  @IsString({ message: msg('Password must be a string', 'كلمة المرور يجب أن تكون نصاً') })
  @IsNotEmpty({ message: msg('Password is required', 'كلمة المرور مطلوبة ولا يمكن أن تكون فارغة') })
  @MinLength(8, { message: msg('Password must be at least 8 characters long', 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل') })
  password!: string;

  @ApiProperty({ example: '+962' })
  @IsString({ message: msg('Phone dial code must be a string', 'رمز الدولة يجب أن يكون نصاً') })
  @IsNotEmpty({ message: msg('Phone dial code is required', 'رمز الدولة مطلوب') })
  phoneDialCode!: string;

  @ApiProperty({ example: '791234567' })
  @IsString({ message: msg('Phone number must be a string', 'رقم الهاتف يجب أن يكون نصاً') })
  @IsNotEmpty({ message: msg('Phone number is required', 'رقم الهاتف مطلوب') })
  phoneNumber!: string;

  @ApiProperty({ example: 'Garry Kasparov' })
  @IsString({ message: msg('Full name must be a string', 'الاسم الكامل يجب أن يكون نصاً') })
  @IsNotEmpty({ message: msg('Full name is required', 'الاسم الكامل مطلوب') })
  fullName!: string;

  @ApiProperty({ example: '1963-04-13', description: 'Format strictly as YYYY-MM-DD' })
  @IsString({ message: msg('Date of birth must be a string', 'تاريخ الميلاد يجب أن يكون نصاً') })
  @IsNotEmpty({ message: msg('Date of birth is required', 'تاريخ الميلاد مطلوب') })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: msg('dateOfBirth must be formatted strictly as YYYY-MM-DD', 'تاريخ الميلاد يجب أن يكون بالصيغة YYYY-MM-DD'),
  })
  dateOfBirth!: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender, { message: msg('Invalid gender value', 'قيمة الجنس غير صالحة') })
  @IsNotEmpty({ message: msg('Gender is required', 'حقل الجنس مطلوب') })
  gender!: Gender;

  @ApiPropertyOptional({ example: '4100018' })
  @IsString({ message: msg('FIDE ID must be a string', 'معرف FIDE يجب أن يكون نصاً') })
  @IsOptional()
  fideId?: string;
}

// ==========================================
// SUB-PROFILES (Standard vs FIDE)
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

  @ApiPropertyOptional({ example: 1963, description: 'Integer birth year' })
  @Expose()
  yearOfBirth?: number;

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
  @Expose()
  username!: string;

  @ApiProperty({ example: 'garry.kasparov@example.com' })
  @Expose()
  email!: string;

  @ApiPropertyOptional({ example: '+962' })
  @Expose({ name: 'phoneDialCode' })
  phoneDialCode?: string;

  @ApiPropertyOptional({ example: '791234567' })
  @Expose({ name: 'phoneNumber' })
  phoneNumber?: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @Expose()
  gender!: Gender;

  @ApiProperty({ example: '1963-04-13T00:00:00.000Z' })
  @Expose()
  dateOfBirth!: Date;

  @ApiPropertyOptional({
    description: 'Present only when player has FIDE rating data or profile',
  })
  @Expose()
  @Type(() => FidePlayerProfileDto)
  playerProfile?: FidePlayerProfileDto | StandardPlayerProfileDto;
}