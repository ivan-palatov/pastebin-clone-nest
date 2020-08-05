import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { PastesService } from 'src/pastes/pastes.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly pasteService: PastesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Get(':id/pastes')
  getUserPastes(@Param('id', ParseIntPipe) authorId: number) {
    return this.pasteService.pastes({
      take: 20,
      orderBy: { date: 'desc' },
      where: {
        exposure: 'PUBLIC',
        expiresIn: { gte: new Date() },
        authorId,
      },
    });
  }
}
