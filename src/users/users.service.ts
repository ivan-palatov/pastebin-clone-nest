import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Exposure,
  UserCreateInput,
  UserCreateWithoutPastesInput,
  UserOrderByInput,
  UserUpdateInput,
  UserWhereInput,
  UserWhereUniqueInput,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(where: UserWhereUniqueInput) {
    return this.prisma.user.findOne({ where });
  }

  async findOneOrThrow(where: UserWhereUniqueInput) {
    const user = await this.prisma.user.findOne({
      where,
      select: {
        id: true,
        email: true,
        photo: true,
        name: true,
        pastes: {
          take: 20,
          orderBy: { date: 'desc' },
          where: { exposure: Exposure.PUBLIC },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
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

  async updateUser(where: UserWhereUniqueInput, data: UserUpdateInput) {
    const user = await this.prisma.user.findOne({ where });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({ where, data });
  }

  async changePassword(
    where: UserWhereUniqueInput,
    editDto: ChangePasswordDto,
  ) {
    const user = await this.prisma.user.findOne({ where });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (
      user.password &&
      (!editDto.currentPassword ||
        !(await bcrypt.compare(editDto.currentPassword, user.password)))
    ) {
      throw new ForbiddenException('Current password is incorrect');
    }

    return this.prisma.user.update({
      where,
      data: { password: await bcrypt.hash(editDto.newPassword, 10) },
    });
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
