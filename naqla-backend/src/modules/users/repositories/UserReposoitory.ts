// src/modules/users/infrastructure/repositories/user.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/db/PrismaService';

import { UserStatus } from 'src/common/enums/user-status';
import { CreateUserData, IUserRepository, UpdateUserData } from './interface/IUserReposoitory';
import { IUser } from './contract/User';

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
        ...(data.id && { id: data.id }),
        username: data.username,
        email: data.email,
        phoneDialCode: data.phoneDialCode,
        phoneNumber: data.phoneNumber,
        roleId: data.roleId,
      },
    });
    return this.mapToDomain(user);
  }

  async update(id: string, data: UpdateUserData): Promise<IUser> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.username && { username: data.username }),
        ...(data.email && { email: data.email }),
        ...(data.phoneDialCode && { phoneDialCode: data.phoneDialCode }),
        ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
        ...(data.roleId && { roleId: data.roleId }),
        ...(data.status && { status: data.status as any }),
        ...(data.isVerifiedUser !== undefined && { isVerifiedUser: data.isVerifiedUser }),
      },
    });
    return this.mapToDomain(user);
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? this.mapToDomain(user) : null;
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