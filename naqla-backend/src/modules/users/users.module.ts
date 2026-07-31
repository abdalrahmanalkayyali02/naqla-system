// src/modules/users/users.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthRegistrationController, USER_SERVICE } from './controllers/AuthRegistration.controller';

// Repositories & Interfaces
import { USER_REPOSITORY } from './repositories/interface/IUserReposoitory';
import { UserRepository } from './repositories/UserReposoitory';
import { USER_PROFILE_REPOSITORY } from './repositories/interface/IUsersProfileReposoitory';
import { UserProfileRepository } from './repositories/UserProfileRepository';
import { PLAYER_PROFILE_REPOSITORY } from './repositories/interface/IPlayerProfileRepository';
import { PlayerProfileRepository } from './repositories/PlayerProfileRepository';
import { RATING_EVENT_REPOSITORY } from './repositories/interface/IRatingEventReposoitory';
import { RatingEventRepository } from './repositories/RattingEventReposoitory';

// Services
import { UserService } from './services/UserService.service';

// Integrations
import { FIDE_PROVIDER } from 'src/integration/interface/IFideProvider';
import { LichessFideProviderAdapter } from 'src/integration/LichessFideProviderAdapter';

@Module({
  imports: [HttpModule],
  controllers: [AuthRegistrationController],
  providers: [
    // Service Binding
    {
      provide: USER_SERVICE,
      useClass: UserService,
    },
    // Repository Bindings
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: USER_PROFILE_REPOSITORY,
      useClass: UserProfileRepository,
    },
    {
      provide: PLAYER_PROFILE_REPOSITORY,
      useClass: PlayerProfileRepository,
    },
    {
      provide: RATING_EVENT_REPOSITORY,
      useClass: RatingEventRepository,
    },
    // External Provider Binding
    {
      provide: FIDE_PROVIDER,
      useClass: LichessFideProviderAdapter,
    },
  ],
  exports: [USER_SERVICE],
})
export class UsersModule {}