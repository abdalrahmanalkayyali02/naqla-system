import { Result } from "src/common/Result";
import { CreateStandardPlayerDto, StandardPlayerResponseDto } from "../../dtos/player/create-standerPlayer.dtos";

export interface IUserService {

  createPlayer(
    playerData: CreateStandardPlayerDto,
  ): Promise<Result<StandardPlayerResponseDto>>;

}