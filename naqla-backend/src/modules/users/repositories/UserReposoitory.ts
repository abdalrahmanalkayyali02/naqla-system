// src/modules/users/infrastructure/repositories/user.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/db/PrismaService';
import { IUser } from './contract/User';
import { CreateUserData, IUserRepository } from './interface/IUserReposoitory';
import { UserStatus } from 'src/common/enums/user-status';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(user: any): IUser {
    return {
      id: user.id,
      userName: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      phoneDialCode: user.phoneDialCode,
      isVerifiedUser: user.isVerifiedUser,
      userStatus: user.status as UserStatus,
    };
  }

  async create(data: CreateUserData): Promise<IUser> {
    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        phoneDialCode: data.phoneDialCode,
        phoneNumber: data.phoneNumber,
        roleId: data.roleId,
      },
    });
    return this.mapToDomain(user);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? this.mapToDomain(user) : null;
  }

  async findByUsername(username: string): Promise<IUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    return user ? this.mapToDomain(user) : null;
  }

  async findByPhone(
    phoneDialCode: string,
    phoneNumber: string,
  ): Promise<IUser | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        phoneDialCode,
        phoneNumber,
      },
    });
    return user ? this.mapToDomain(user) : null;
  }
}