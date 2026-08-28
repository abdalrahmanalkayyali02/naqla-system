
import { PlayerTitle } from 'src/common/enums/player-title';
import { PlayerType } from 'src/common/enums/player-type';
import { Gender } from 'src/common/enums/user-gender';

export class IPlayerProfile {
  id!: string;
  userId!: string;
  fullName!: string;
  gender?: Gender | null;
  dateOfBirth?: Date | null;
  fideId?: string | null;
  playerFederation?: string | null;
  playerType!: PlayerType;
  playerTitle?: PlayerTitle | null;
  classicalRating!: number;
  blitzRating!: number;
  rapidRating!: number;
  createdAt?: Date;
  updatedAt?: Date;
}