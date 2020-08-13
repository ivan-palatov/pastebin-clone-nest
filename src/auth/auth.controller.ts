import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  login(@Body() userDto: LoginUserDto) {
    return this.authService.login(userDto);
  }

  @Post('register')
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    throw new UnauthorizedException('Please, login with google');
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req: Request, @Res() res: Response) {
    if (!req.user || !(req.user as any).token) {
      throw new UnauthorizedException('Google login failed');
    }

    return res.redirect(
      `${this.configService.get('CLIENT_URL') as string}/oauth/?token=${
        (req.user as any).token
      }`,
    );
  }

  @Get('vk')
  @UseGuards(AuthGuard('vk'))
  vkLogin() {
    throw new UnauthorizedException('Please, login with vk.com');
  }

  @Get('vk/callback')
  @UseGuards(AuthGuard('vk'))
  vkLoginCallback(@Req() req: Request, @Res() res: Response) {
    if (!req.user || !(req.user as any).token) {
      throw new UnauthorizedException('VK login failed');
    }

    return res.redirect(
      `${this.configService.get('CLIENT_URL') as string}/oauth/?token=${
        (req.user as any).token
      }`,
    );
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {
    throw new UnauthorizedException('Please, login with github');
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubLoginCallback(@Req() req: Request, @Res() res: Response) {
    if (!req.user || !(req.user as any).token) {
      throw new UnauthorizedException('Github login failed');
    }

    return res.redirect(
      `${this.configService.get('CLIENT_URL') as string}/oauth/?token=${
        (req.user as any).token
      }`,
    );
  }
}
