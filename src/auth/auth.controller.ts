import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() userDto: LoginUserDto) {
    return this.authService.login(userDto);
  }

  @Post('register')
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @Get()
  @UseGuards(AuthGuard(['jwt', 'google']))
  testGuard(@CurrentUser() user: User) {
    // TODO: Make CurrentUser work without UseGuard
    console.log('Current User: ', user);
    return { user };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    throw new UnauthorizedException('Please, login with google');
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req) {
    console.log('USER in google/callbacK: ', req.user);
    if (!req.user || !req.user.token) {
      throw new UnauthorizedException('Google login failed');
    }

    return req.user;
  }
}
