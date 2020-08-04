import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
  @UseGuards(AuthGuard())
  testGuard(@CurrentUser() user: User) {
    // TODO: Make CurrentUser work without UseGuard
    console.log('Current User: ', user);
    return { user };
  }
}
