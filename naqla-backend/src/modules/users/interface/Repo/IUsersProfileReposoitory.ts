// src/modules/users/domain/repositories/user-profile.repository.interface.ts

import { Gender } from "src/common/enums/user-gender";
import { IUserProfile } from "src/core/db/contracts/UserProfile";

export interface CreateUserProfileData {
  userId: string;
  firstName: string;
  lastName: string;
  gender?: Gender;
  dateOfBirth?: Date;
}

export interface ChesPlayerFideData {
  fideId: string;
  fullName: string;
  gender: Gender;
  playerFederation: string;
  playerType: string;
  playerTitle: string;
  classicalRating?: number;
  blitzRating?: number;
  rapidRating?: number;
  dateOfBirth?: Date;
}

export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  dateOfBirth?: Date;
}

export interface IUserProfileRepository {
  create(data: CreateUserProfileData): Promise<IUserProfile>;
  findByUserId(userId: string): Promise<IUserProfile | null>;
  updateByUserId(userId: string, data: UpdateUserProfileData): Promise<IUserProfile>;
}

export const USER_PROFILE_REPOSITORY = Symbol('IUserProfileRepository');