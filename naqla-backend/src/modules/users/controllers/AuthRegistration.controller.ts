// src/modules/auth/presentation/auth-registration.controller.ts

import {
  Controller,
  Post,
  Body,
  Inject,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProduces,
  ApiConsumes,
} from '@nestjs/swagger';

import {
  CreateStandardPlayerDto,
  StandardPlayerResponseDto,
} from '../dtos/player/create-standerPlayer.dtos';
import type { IUserService } from 'src/modules/users/services/interface/IUserService';
import { handleResult } from 'src/common/utils/handleResult';

export const USER_SERVICE = Symbol('IUserService');

@ApiTags('Auth & Registration')
@Controller('api/v1/auth')
export class AuthRegistrationController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
  ) {}

  // ==========================================
  // 1. PLAYER REGISTRATION
  // ==========================================

  @Post('register/player/standard')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register Standard Player',
    description: 'Creates a standard player account via credentials.',
  })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: StandardPlayerResponseDto,
  })
  public async registerStandardPlayer(
    @Body() dto: CreateStandardPlayerDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.userService.createStandardPlayer(dto);
    handleResult(req, res, result);
  }

  @Post('register/player/google')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register Player via Google OAuth' })
  public async registerPlayerGoogle(@Req() req: Request, @Res() res: Response): Promise<void> {
    // TODO: Google player registration logic
  }

  @Post('register/player/apple')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register Player via Apple ID' })
  public async registerPlayerApple(@Req() req: Request, @Res() res: Response): Promise<void> {
    // TODO: Apple player registration logic
  }

  // ==========================================
  // 2. ARBITER REGISTRATION
  // ==========================================

  @Post('register/arbiter/standard')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register Standard Arbiter',
    description: 'Registers an official chess arbiter account via credentials.',
  })
  public async registerStandardArbiter(@Req() req: Request, @Res() res: Response): Promise<void> {
    // TODO: Standard arbiter registration logic
  }

  @Post('register/arbiter/google')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register Arbiter via Google OAuth' })
  public async registerArbiterGoogle(@Req() req: Request, @Res() res: Response): Promise<void> {
    // TODO: Google arbiter registration logic
  }

  @Post('register/arbiter/apple')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register Arbiter via Apple ID' })
  public async registerArbiterApple(@Req() req: Request, @Res() res: Response): Promise<void> {
    // TODO: Apple arbiter registration logic
  }

  // ==========================================
  // 3. ORGANIZER REGISTRATION (STANDARD ONLY)
  // ==========================================

  @Post('register/organizer/standard')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register Standard Organizer',
    description: 'Registers a tournament organizer account via credentials (No OAuth supported).',
  })
  public async registerStandardOrganizer(@Req() req: Request, @Res() res: Response): Promise<void> {
    // TODO: Standard organizer registration logic
  }

  // ==========================================
  // 4. AUTHENTICATION & OTP WORKFLOWS
  // ==========================================

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Login' })
  public async login(@Req() req: Request, @Res() res: Response): Promise<void> {
    // TODO: Login logic
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP' })
  public async verifyOtp(@Req() req: Request, @Res() res: Response): Promise<void> {
    // TODO: Verify OTP logic
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend Verification OTP' })
  public async resendOtp(@Req() req: Request, @Res() res: Response): Promise<void> {
    // TODO: Resend OTP logic
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