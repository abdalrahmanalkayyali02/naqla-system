// ==========================================
// REQUEST DTO — Google Player OAuth
// ==========================================

import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";
import { msg } from "src/common/const/msg.const";

export class RegisterPlayerGoogleDto {
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