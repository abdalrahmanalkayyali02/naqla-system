// src/modules/auth/presentation/account-registration.controller.ts

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
} from '../../users/dtos/player/create-standerPlayer.dtos';
import { handleResult } from 'src/common/utils/handleResult';
import { ACCOUNT_REGISTRATION_SERVICE, type IAccountRegistrationService } from '../services/interface/IAccountRegistrationService';


@ApiTags('Account Registration')
@Controller('auth/register')
export class AccountRegistrationController {
  constructor(
    @Inject(ACCOUNT_REGISTRATION_SERVICE)
    private readonly accountRegistrationService: IAccountRegistrationService,
  ) {}

  // ==========================================
  // 1. PLAYER REGISTRATION
  // ==========================================

  @Post('player/standard')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register Standard Player',
    description: 'Creates a standard or FIDE player account via credentials.',
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
    const result = await this.accountRegistrationService.createStandardPlayer(dto);
    handleResult(req, res, result);
  }

  @Post('player/google')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register Player via Google OAuth' })
  public async registerPlayerGoogle(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    // TODO: Google player registration logic via Better Auth OAuth Provider
  }

  @Post('player/apple')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register Player via Apple ID' })
  public async registerPlayerApple(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    // TODO: Apple player registration logic
  }

  // ==========================================
  // 2. ARBITER REGISTRATION
  // ==========================================

  @Post('arbiter/standard')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register Standard Arbiter',
    description: 'Registers an official chess arbiter account via credentials.',
  })
  public async registerStandardArbiter(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    // TODO: Standard arbiter registration logic
  }

  @Post('arbiter/google')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register Arbiter via Google OAuth' })
  public async registerArbiterGoogle(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    // TODO: Google arbiter registration logic
  }

  // ==========================================
  // 3. ORGANIZER REGISTRATION
  // ==========================================

  @Post('organizer/standard')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register Standard Organizer',
    description: 'Registers a tournament organizer account via credentials.',
  })
  public async registerStandardOrganizer(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    // TODO: Standard organizer registration logic
  }
}