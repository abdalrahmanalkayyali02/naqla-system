import { Result } from 'src/common/Result';
import {
  CreateStandardPlayerDto,
  StandardPlayerResponseDto,
} from '../dtos/player/create-standerPlayer.dtos';
import { IUserService } from './interface/IUserService';
import { IUserRepository } from '../repositories/interface/IUserReposoitory';
import { IUserProfileRepository } from '../repositories/interface/IUsersProfileReposoitory';
import { IPlayerProfileRepository } from '../repositories/interface/IPlayerProfileRepository';
import { IRatingEventRepository } from '../repositories/interface/IRatingEventReposoitory';

export class UserService implements IUserService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly userProfileRepo: IUserProfileRepository,
    private readonly playerProfileRepo: IPlayerProfileRepository,
    private readonly ratingEventRepo: IRatingEventRepository, 
  ) {}

  public async createPlayer(
    playerData: CreateStandardPlayerDto,
  ): Promise<Result<StandardPlayerResponseDto>> {
    throw new Error('Method not implemented.');
  }

  
}
