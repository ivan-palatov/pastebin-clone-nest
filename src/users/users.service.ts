import { ConflictException, Injectable } from '@nestjs/common';
import {
  User,
  UserCreateInput,
  UserOrderByInput,
  UserUpdateInput,
  UserWhereInput,
  UserWhereUniqueInput,
} from '@prisma/client';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
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
    const user = await this.prisma.user.findMany({
      where: { OR: [{ email: data.email }, { name: data.name }] },
    });
    if (user.length > 0) {
      throw new ConflictException('User already exists');
    }

    const password = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({ data: { ...data, password } });
  }

  async updateUser(params: {
    where: UserWhereUniqueInput;
    data: UserUpdateInput;
  }) {
    // TODO: check if has rights
    return this.prisma.user.update(params);
  }

  async deleteUser(where: UserWhereUniqueInput) {
    // TODO: check if has rights
    return this.prisma.user.delete({ where });
  }
}
