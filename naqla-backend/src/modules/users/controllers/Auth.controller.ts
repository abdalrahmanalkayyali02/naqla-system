// src/modules/auth/presentation/auth.controller.ts

import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Authentication & OTP')
@Controller('auth')
export class AuthController {
  
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Login Credentials' })
  public async login(@Req() req: Request, @Res() res: Response): Promise<void> {
    // TODO: Login logic via Better Auth or AuthFlowService
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP' })
  public async verifyOtp(@Req() req: Request, @Res() res: Response): Promise<void> {
    // TODO: Verify OTP logic with Redis
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend Verification OTP' })
  public async resendOtp(@Req() req: Request, @Res() res: Response): Promise<void> {
    // TODO: Resend OTP logic with Redis Rate Limit
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request Password Reset OTP' })
  public async forgotPassword(@Req() req: Request, @Res() res: Response): Promise<void> {
    // TODO: Forgot password logic
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update / Reset Password' })
  public async resetPassword(@Req() req: Request, @Res() res: Response): Promise<void> {
    // TODO: Reset password logic
  }
}