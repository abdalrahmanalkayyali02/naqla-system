// src/modules/users/domain/repositories/user.repository.interface.ts

import { IUser } from '../contract/User';

export const USER_REPOSITORY = Symbol('IUserRepository');

export interface CreateUserData {
  id?: string; // اختياري في حال تم إنشاؤه مسبقاً عبر Better Auth
  username: string;
  email: string;
  phoneDialCode?: string;
  phoneNumber?: string;
  roleId: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  phoneDialCode?: string;
  phoneNumber?: string;
  roleId?: string;
  status?: string;
  isVerifiedUser?: boolean;
}

export interface IUserRepository {
  create(data: CreateUserData): Promise<IUser>;
  update(id: string, data: UpdateUserData): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  findByPhone(phoneDialCode: string, phoneNumber: string): Promise<IUser | null>;
}