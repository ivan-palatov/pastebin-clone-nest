import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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
  getProfile(@Request() req) {
    return req.user;
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
