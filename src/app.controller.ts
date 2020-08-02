import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { PastesService } from './pastes/pastes.service';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UsersService,
    private readonly pasteService: PastesService,
    private readonly authService: AuthService,
  ) {}

  @Get('paste/:id')
  getPasteById(@Param('id') id: string) {
    return this.pasteService.paste({ id: Number(id) });
  }

  @Get('pastes')
  getPublicPastes() {
    return this.pasteService.pastes({
      take: 10,
      orderBy: { date: 'desc' },
      where: { exposure: 'PUBLIC', expiresIn: { gte: new Date() } },
    });
  }

  @Get('u/:id/pastes')
  getUserPastes(@Param('id') id: string) {
    return this.pasteService.pastes({
      take: 20,
      orderBy: { date: 'desc' },
      where: {
        exposure: 'PUBLIC',
        expiresIn: { gte: new Date() },
        authorId: Number(id),
      },
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
