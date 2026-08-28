import { Result } from "src/common/Result";
import { CreateStandardPlayerDto, StandardPlayerResponseDto,  } from "../../dtos/player/create-standerPlayer.dtos";
import { CreateStandardArbiterDto, RegisterArbiterGoogleDto, ArbiterResponseDto } from "../../dtos/aribiter/create-arbiter.dtos";
import { CreateStandardOrganizerDto, OrganizerResponseDto } from "../../dtos/orginizer/create-organizer.dtos";
import { RegisterPlayerGoogleDto } from "../../dtos/player/create-google-player.dtos";

export interface IAccountRegistrationService {

  createStandardPlayer(
    playerData: CreateStandardPlayerDto,
  ): Promise<Result<StandardPlayerResponseDto>>;

  createGooglePlayer(
    googleData: RegisterPlayerGoogleDto,
  ): Promise<Result<StandardPlayerResponseDto>>;

  createStandardArbiter(
    arbiterData: CreateStandardArbiterDto,
  ): Promise<Result<ArbiterResponseDto>>;

  createGoogleArbiter(
    googleData: RegisterArbiterGoogleDto,
  ): Promise<Result<ArbiterResponseDto>>;

  createStandardOrganizer(
    organizerData: CreateStandardOrganizerDto,
  ): Promise<Result<OrganizerResponseDto>>;

}

export const ACCOUNT_REGISTRATION_SERVICE = Symbol('IAccountRegistrationService');