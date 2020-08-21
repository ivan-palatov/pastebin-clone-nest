import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneOrThrow({ id });
  }

  @UseGuards(JwtAuthGuard)
  async editUser(@Body() editDto: EditUserDto, @CurrentUser('id') id: number) {
    await this.usersService.updateUser({ id }, editDto);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() editDto: ChangePasswordDto,
    @CurrentUser('id') id: number,
  ) {
    await this.usersService.changePassword({ id }, editDto);
    return true;
  }
}
