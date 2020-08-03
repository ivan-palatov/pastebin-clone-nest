import { Body, Controller, Post, Request } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }
}
