// src/modules/users/domain/repositories/user-profile.repository.interface.ts

import { Gender } from "src/common/enums/user-gender";


export interface CreateUserProfileData {
  userId: string;
  firstName: string;
  lastName: string;
  gender?: Gender;
}

export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  gender?: Gender;
}

export interface IUserProfileRepository {
  create(data: CreateUserProfileData): Promise<any>;
  findByUserId(userId: string): Promise<any | null>;
  updateByUserId(userId: string, data: UpdateUserProfileData): Promise<any>;
}

export const USER_PROFILE_REPOSITORY = Symbol('IUserProfileRepository');