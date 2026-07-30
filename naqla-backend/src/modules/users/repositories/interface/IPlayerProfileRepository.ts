// src/modules/players/domain/repositories/player-profile.repository.interface.ts

import { PlayerTitle } from "src/common/enums/player-title";
import { PlayerType } from "src/common/enums/player-type";
import { Gender } from "src/common/enums/user-gender";


export interface CreatePlayerProfileData {
  userId: string;
  fullName: string;
  gender: Gender;
  fideId?: string;
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
}

export interface UpdateRatingsData {
  classicalRating?: number;
  blitzRating?: number;
  rapidRating?: number;
}

export interface IPlayerProfileRepository {
  create(data: CreatePlayerProfileData): Promise<any>;
  findById(id: string): Promise<any | null>;
  findByUserId(userId: string): Promise<any | null>;
  findByFideId(fideId: string): Promise<any | null>;
  updateByUserId(userId: string, data: UpdatePlayerProfileData): Promise<any>;
  updateRatings(playerId: string, ratings: UpdateRatingsData): Promise<any>;
}

export const PLAYER_PROFILE_REPOSITORY = Symbol('IPlayerProfileRepository');