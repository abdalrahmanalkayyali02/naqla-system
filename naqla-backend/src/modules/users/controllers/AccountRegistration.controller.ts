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
import {
  CreateStandardArbiterDto,
  RegisterArbiterGoogleDto,
  ArbiterResponseDto,
} from '../../users/dtos/aribiter/create-arbiter.dtos';
import {
  CreateStandardOrganizerDto,
  OrganizerResponseDto,
} from '../../users/dtos/orginizer/create-organizer.dtos';

import { handleResult } from 'src/common/utils/handleResult';
import { ACCOUNT_REGISTRATION_SERVICE, type IAccountRegistrationService } from '../interface/Service/IAccountRegistrationService';
import { RegisterPlayerGoogleDto } from '../dtos/player/create-google-player.dtos';


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
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: StandardPlayerResponseDto,
  })
  public async registerPlayerGoogle(
    @Body() dto: RegisterPlayerGoogleDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.accountRegistrationService.createGooglePlayer(dto);
    handleResult(req, res, result);
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
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ArbiterResponseDto,
  })
  public async registerStandardArbiter(
    @Body() dto: CreateStandardArbiterDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.accountRegistrationService.createStandardArbiter(dto);
    handleResult(req, res, result);
  }

  @Post('arbiter/google')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register Arbiter via Google OAuth' })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ArbiterResponseDto,
  })
  public async registerArbiterGoogle(
    @Body() dto: RegisterArbiterGoogleDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.accountRegistrationService.createGoogleArbiter(dto);
    handleResult(req, res, result);
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
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: OrganizerResponseDto,
  })
  public async registerStandardOrganizer(
    @Body() dto: CreateStandardOrganizerDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.accountRegistrationService.createStandardOrganizer(dto);
    handleResult(req, res, result);
  }
}