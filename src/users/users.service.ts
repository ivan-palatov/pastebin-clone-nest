import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  UserCreateInput,
  UserCreateWithoutPastesInput,
  UserOrderByInput,
  UserUpdateInput,
  UserWhereInput,
  UserWhereUniqueInput,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(where: UserWhereUniqueInput) {
    return this.prisma.user.findOne({ where });
  }

  async findOneOrCreate(where: UserWhereUniqueInput, data: UserCreateInput) {
    const user = await this.prisma.user.findOne({ where });
    if (user) {
      return user;
    }

    return this.prisma.user.create({ data });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: UserWhereUniqueInput;
    where?: UserWhereInput;
    orderBy?: UserOrderByInput;
  }) {
    return this.prisma.user.findMany(params);
  }

  async createUser(data: UserCreateWithoutPastesInput) {
    const user = await this.prisma.user.findOne({
      where: { email: data.email },
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const password = await bcrypt.hash(data.password!, 10);
    return this.prisma.user.create({ data: { ...data, password } });
  }

  async updateUser(
    where: UserWhereUniqueInput,
    data: UserUpdateInput,
    currentUserId: number,
  ) {
    const user = await this.prisma.user.findOne({ where });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.id !== currentUserId) {
      throw new ForbiddenException();
    }
    return this.prisma.user.update({ where, data });
  }

  async deleteUser(where: UserWhereUniqueInput, currentUserId: number) {
    const user = await this.prisma.user.findOne({ where });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.id !== currentUserId) {
      throw new ForbiddenException();
    }

    return this.prisma.user.delete({ where });
  }
}
