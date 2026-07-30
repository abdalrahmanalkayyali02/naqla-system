// src/modules/users/domain/repositories/user.repository.interface.ts


export interface CreateUserData {
  username: string;
  email: string;
  phoneDialCode?: string;
  phoneNumber?: string;
}

export interface UpdateUserData {
  email?: string;
  phoneDialCode?: string;
  phoneNumber?: string;
}

export interface IUserRepository {
  create(data: CreateUserData): Promise<any>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');