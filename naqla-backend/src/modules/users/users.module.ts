// src/modules/users/users.module.ts

import { Module } from '@nestjs/common';
import { AccountRegistrationController } from './controllers/AccountRegistration.controller';
import { AuthController } from './controllers/Auth.controller';

// Service interface (DI token)
import { ACCOUNT_REGISTRATION_SERVICE } from './services/interface/IAccountRegistrationService';

// FIDE external module
import { FideModule } from 'src/modules/fide/fide.module';

// Repository interfaces (DI tokens)
import { USER_REPOSITORY } from './repositories/interface/IUserReposoitory';
import { USER_PROFILE_REPOSITORY } from './repositories/interface/IUsersProfileReposoitory';
import { PLAYER_PROFILE_REPOSITORY } from './repositories/interface/IPlayerProfileRepository';
import { FIDE_RATING_SNAPSHOT_REPOSITORY } from './repositories/interface/IFideRatingSnapshotRepository';

// Repository implementations
import { UserRepository } from './repositories/UserReposoitory';
import { UserProfileRepository } from './repositories/UserProfileRepository';
import { PlayerProfileRepository } from './repositories/PlayerProfileRepository';
import { FideRatingSnapshotRepository } from './repositories/FideRatingSnapshotRepository';

// Services
import { AccountRegistrationService } from './services/AccountRegistrationService';

@Module({
  imports: [
    FideModule, // provides & exports FIDE_PROVIDER + LichessFideProviderAdapter
  ],
  controllers: [AccountRegistrationController, AuthController],
  providers: [
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