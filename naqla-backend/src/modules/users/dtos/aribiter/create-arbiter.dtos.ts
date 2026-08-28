// src/modules/users/dtos/aribiter/create-arbiter.dtos.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
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

import { msg } from 'src/common/const/msg.const';
// ==========================================
// REQUEST DTO — Standard Arbiter
// ==========================================

export class CreateStandardArbiterDto {
  @ApiProperty({ example: 'arbiter_ali' })
  @IsString({ message: msg('Username must be a string', 'اسم المستخدم يجب أن يكون نصاً') })
  @IsNotEmpty({ message: msg('Username is required', 'اسم المستخدم مطلوب') })
  username!: string;

  @ApiProperty({ example: 'ali.arbiter@example.com' })
  @IsEmail({}, { message: msg('Invalid email address format', 'صيغة البريد الإلكتروني غير صالحة') })
  @IsNotEmpty({ message: msg('Email is required', 'البريد الإلكتروني مطلوب') })
  email!: string;

  @ApiProperty({ example: 'P@ssword123!', description: 'Minimum 8 characters' })
  @IsString({ message: msg('Password must be a string', 'كلمة المرور يجب أن تكون نصاً') })
  @IsNotEmpty({ message: msg('Password is required', 'كلمة المرور مطلوبة') })
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

  @ApiProperty({ example: 'Ali Mahmoud' })
  @IsString({ message: msg('Full name must be a string', 'الاسم الكامل يجب أن يكون نصاً') })
  @IsNotEmpty({ message: msg('Full name is required', 'الاسم الكامل مطلوب') })
  fullName!: string;

  @ApiProperty({ example: '1985-06-20', description: 'Format strictly as YYYY-MM-DD' })
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

  @ApiPropertyOptional({ example: 'FA', description: 'FIDE Arbiter title: FA, IA, NA' })
  @IsString({ message: msg('Arbiter title must be a string', 'لقب الحَكَم يجب أن يكون نصاً') })
  @IsOptional()
  arbiterTitle?: string;

  @ApiPropertyOptional({ example: 'JOR', description: 'ISO 3166-1 alpha-3 federation country code' })
  @IsString({ message: msg('Federation must be a string', 'الاتحاد يجب أن يكون نصاً') })
  @IsOptional()
  federation?: string;
}

// ==========================================
// REQUEST DTO — Google Arbiter OAuth
// ==========================================

export class RegisterArbiterGoogleDto {
  @ApiProperty({
    example: 'ya29.a0AfH6SMBY...',
    description: 'Google OAuth access token obtained from the client',
  })
  @IsString({ message: msg('Google access token must be a string', 'رمز Google يجب أن يكون نصاً') })
  @IsNotEmpty({ message: msg('Google access token is required', 'رمز Google مطلوب') })
  googleAccessToken!: string;

  @ApiProperty({ example: '+962' })
  @IsString({ message: msg('Phone dial code must be a string', 'رمز الدولة يجب أن يكون نصاً') })
  @IsNotEmpty({ message: msg('Phone dial code is required', 'رمز الدولة مطلوب') })
  phoneDialCode!: string;

  @ApiProperty({ example: '791234567' })
  @IsString({ message: msg('Phone number must be a string', 'رقم الهاتف يجب أن يكون نصاً') })
  @IsNotEmpty({ message: msg('Phone number is required', 'رقم الهاتف مطلوب') })
  phoneNumber!: string;
}

// ==========================================
// RESPONSE DTO
// ==========================================

export class ArbiterResponseDto {
  @ApiProperty({ example: '9e640a4e-e4cd-4785-a7c5-02c5e1fd82cd' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'arbiter_ali' })
  @Expose()
  username!: string;

  @ApiProperty({ example: 'ali.arbiter@example.com' })
  @Expose()
  email!: string;

  @ApiPropertyOptional({ example: '+962' })
  @Expose()
  phoneDialCode?: string;

  @ApiPropertyOptional({ example: '791234567' })
  @Expose()
  phoneNumber?: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @Expose()
  gender!: Gender;

  @ApiProperty({ example: '1985-06-20' })
  @Expose()
  dateOfBirth!: string;

  @ApiPropertyOptional({ example: 'FA' })
  @Expose()
  arbiterTitle?: string;

  @ApiPropertyOptional({ example: 'JOR' })
  @Expose()
  federation?: string;
}
