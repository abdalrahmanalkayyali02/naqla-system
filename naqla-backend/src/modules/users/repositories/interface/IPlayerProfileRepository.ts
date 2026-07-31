// src/modules/players/domain/repositories/player-profile.repository.interface.ts

import { PlayerTitle } from "src/common/enums/player-title";
import { PlayerType } from "src/common/enums/player-type";
import { Gender } from "src/common/enums/user-gender";
import { IPlayerProfile } from "../contract/playerProfile";


export interface CreatePlayerProfileData {
  userId: string;
  fullName: string;
  gender: Gender;
  fideId?: string;
  dateOfBirth: Date;
  playerFederation?: string;
  playerType?: PlayerType;
  playerTitle?: PlayerTitle;
  classicalRating?: number;
  blitzRating?: number;
  rapidRating?: number;
}

export interface UpdatePlayerProfileData {
  fullName?: string;
  gender?: Gender;
  fideId?: string;
  playerFederation?: string;
  playerType?: PlayerType;
  playerTitle?: PlayerTitle;
  classicalRating?: number;
  blitzRating?: number;
  rapidRating?: number;
  dateOfBirth?: Date;
}

export interface UpdateRatingsData {
  classicalRating?: number;
  blitzRating?: number;
  rapidRating?: number;
}

export interface IPlayerProfileRepository {
  create(data: CreatePlayerProfileData): Promise<IPlayerProfile>;
  findById(id: string): Promise<IPlayerProfile | null>;
  findByUserId(userId: string): Promise<IPlayerProfile | null>;
  findByFideId(fideId: string): Promise<IPlayerProfile | null>;
  updateByUserId(userId: string, data: UpdatePlayerProfileData): Promise<IPlayerProfile>;
  updateRatings(playerId: string, ratings: UpdateRatingsData): Promise<IPlayerProfile>;
}

export const PLAYER_PROFILE_REPOSITORY = Symbol('IPlayerProfileRepository');