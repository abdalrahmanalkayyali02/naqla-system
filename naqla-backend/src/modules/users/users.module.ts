// src/modules/users/users.module.ts

import { Module } from '@nestjs/common';
import { AccountRegistrationController } from './controllers/AccountRegistration.controller';
import { AuthController } from './controllers/Auth.controller';

// Service interface (DI token)
import { ACCOUNT_REGISTRATION_SERVICE } from './interface/Service/IAccountRegistrationService';

// FIDE external module

// Repository interfaces (DI tokens)
import { USER_REPOSITORY } from './interface/Repo/IUserReposoitory';
import { USER_PROFILE_REPOSITORY } from './interface/Repo/IUsersProfileReposoitory';
import { PLAYER_PROFILE_REPOSITORY } from './interface/Repo/IPlayerProfileRepository';
import { FIDE_RATING_SNAPSHOT_REPOSITORY } from './interface/Repo/IFideRatingSnapshotRepository';

// Repository implementations
import { UserRepository } from './repositories/UserReposoitory';
import { UserProfileRepository } from './repositories/UserProfileRepository';
import { PlayerProfileRepository } from './repositories/PlayerProfileRepository';
import { FideRatingSnapshotRepository } from './repositories/FideRatingSnapshotRepository';

// Services
import { AccountRegistrationService } from './services/AccountRegistrationService';
import { FIDE_PROVIDER } from 'src/integration/interface/IFideProvider';
import { LichessFideProviderAdapter } from 'src/integration/Provider/LichessFideProviderAdapter';
import { HttpModule } from '@nestjs/axios';

@Module({
imports: [
    HttpModule, 
  ],
  controllers: [AccountRegistrationController, AuthController],
  providers: [

    {
      provide: FIDE_PROVIDER,
      useClass: LichessFideProviderAdapter,
    },
    // ── Service ──────────────────────────────────────────────────────────
    {
      provide:  ACCOUNT_REGISTRATION_SERVICE,
      useClass: AccountRegistrationService,
    },
    // ── Repositories ─────────────────────────────────────────────────────
    {
      provide:  USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide:  USER_PROFILE_REPOSITORY,
      useClass: UserProfileRepository,
    },
    {
      provide:  PLAYER_PROFILE_REPOSITORY,
      useClass: PlayerProfileRepository,
    },
    {
      provide:  FIDE_RATING_SNAPSHOT_REPOSITORY,
      useClass: FideRatingSnapshotRepository,
    },
  ],
  exports: [ACCOUNT_REGISTRATION_SERVICE],
})
export class UsersModule {}