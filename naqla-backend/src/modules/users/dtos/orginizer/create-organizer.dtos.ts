// src/modules/users/dtos/orginizer/create-organizer.dtos.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsUrl,
} from 'class-validator';

import { msg } from 'src/common/const/msg.const';
// ==========================================
// REQUEST DTO — Standard Organizer
// ==========================================

export class CreateStandardOrganizerDto {
  @ApiProperty({ example: 'jordan_chess_club' })
  @IsString({ message: msg('Username must be a string', 'اسم المستخدم يجب أن يكون نصاً') })
  @IsNotEmpty({ message: msg('Username is required', 'اسم المستخدم مطلوب') })
  username!: string;

  @ApiProperty({ example: 'organizer@jcf.jo' })
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

  @ApiProperty({ example: '61234567' })
  @IsString({ message: msg('Phone number must be a string', 'رقم الهاتف يجب أن يكون نصاً') })
  @IsNotEmpty({ message: msg('Phone number is required', 'رقم الهاتف مطلوب') })
  phoneNumber!: string;

  @ApiProperty({ example: 'Jordan Chess Federation', description: 'Official organization name' })
  @IsString({ message: msg('Organization name must be a string', 'اسم المنظمة يجب أن يكون نصاً') })
  @IsNotEmpty({ message: msg('Organization name is required', 'اسم المنظمة مطلوب') })
  organizationName!: string;

  @ApiProperty({ example: 'Ahmed Al-Rashidi', description: 'Contact person full name' })
  @IsString({ message: msg('Contact person name must be a string', 'اسم الشخص المسؤول يجب أن يكون نصاً') })
  @IsNotEmpty({ message: msg('Contact person name is required', 'اسم الشخص المسؤول مطلوب') })
  contactPersonName!: string;

  @ApiPropertyOptional({ example: 'https://jcf.jo', description: 'Official website URL' })
  @IsUrl({}, { message: msg('Website must be a valid URL', 'الموقع الإلكتروني يجب أن يكون رابطاً صحيحاً') })
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ example: 'JOR', description: 'ISO 3166-1 alpha-3 country code' })
  @IsString({ message: msg('Country code must be a string', 'رمز الدولة يجب أن يكون نصاً') })
  @IsOptional()
  countryCode?: string;
}

// ==========================================
// RESPONSE DTO
// ==========================================

export class OrganizerResponseDto {
  @ApiProperty({ example: '9e640a4e-e4cd-4785-a7c5-02c5e1fd82cd' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'jordan_chess_club' })
  @Expose()
  username!: string;

  @ApiProperty({ example: 'organizer@jcf.jo' })
  @Expose()
  email!: string;

  @ApiPropertyOptional({ example: '+962' })
  @Expose()
  phoneDialCode?: string;

  @ApiPropertyOptional({ example: '61234567' })
  @Expose()
  phoneNumber?: string;

  @ApiProperty({ example: 'Jordan Chess Federation' })
  @Expose()
  organizationName!: string;

  @ApiProperty({ example: 'Ahmed Al-Rashidi' })
  @Expose()
  contactPersonName!: string;

  @ApiPropertyOptional({ example: 'https://jcf.jo' })
  @Expose()
  website?: string;

  @ApiPropertyOptional({ example: 'JOR' })
  @Expose()
  countryCode?: string;
}
