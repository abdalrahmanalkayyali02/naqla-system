import { Result } from "src/common/Result";
import { CreateStandardPlayerDto, StandardPlayerResponseDto } from "../../dtos/player/create-standerPlayer.dtos";

export interface IAccountRegistrationService {

  createStandardPlayer(
    playerData: CreateStandardPlayerDto,
  ): Promise<Result<StandardPlayerResponseDto>>;

}

export const ACCOUNT_REGISTRATION_SERVICE = Symbol('IAccountRegistrationService');