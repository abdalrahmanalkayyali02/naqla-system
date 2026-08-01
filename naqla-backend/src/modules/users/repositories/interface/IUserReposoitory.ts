// src/modules/users/domain/repositories/user.repository.interface.ts

import { IUser } from '../contract/User';

export const USER_REPOSITORY = Symbol('IUserRepository');

export interface CreateUserData {
  username: string;
  email: string;
  phoneDialCode?: string;
  phoneNumber?: string;
  roleId?: string;
}

export interface UpdateUserData {
  email?: string;
  phoneDialCode?: string;
  phoneNumber?: string;
}

export interface IUserRepository {
  create(data: CreateUserData): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  findByPhone(phoneDialCode: string, phoneNumber: string): Promise<IUser | null>;
}