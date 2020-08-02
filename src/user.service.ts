import { Injectable } from '@nestjs/common';
import {
  User,
  UserCreateInput,
  UserOrderByInput,
  UserUpdateInput,
  UserWhereInput,
  UserWhereUniqueInput,
} from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async user(userWhereUniqueInput: UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findOne({ where: userWhereUniqueInput });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: UserWhereUniqueInput;
    where?: UserWhereInput;
    orderBy?: UserOrderByInput;
  }) {
    return this.prisma.user.findMany(params);
  }

  async createUser(data: UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async updateUser(params: {
    where: UserWhereUniqueInput;
    data: UserUpdateInput;
  }) {
    return this.prisma.user.update(params);
  }

  async deleteUser(where: UserWhereUniqueInput) {
    return this.prisma.user.delete({ where });
  }
}
