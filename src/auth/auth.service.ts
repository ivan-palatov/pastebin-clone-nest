import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

export enum Provider {
  GOOGLE = 'google',
  VK = 'vk',
  GITHUB = 'github',
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(payload: IJwtPayload) {
    const user = await this.usersService.findOne({ email: payload.email });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...res } = user;

    return res;
  }

  async validateOAuthLogin(profile: any, provider: Provider) {
    try {
      // Could add to DB here

      return {
        username: profile.displayName,
        photo: profile.photos[0].value,
        email: profile.emails[0].value,
        token: this._createToken({ sub: profile.id, provider }),
      };
    } catch (e) {
      throw new InternalServerErrorException('validateOAuthLogin', e);
    }
  }

  async register(userDto: CreateUserDto) {
    await this.usersService.createUser(userDto);
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this._createToken({
      email,
      username: user.name,
      sub: user.id,
    });

    return {
      username: user.name,
      photo: (user as any).photo,
      email: user.email,
      token,
    };
  }

  private _createToken(payload: any) {
    return this.jwtService.sign(payload);
  }
}
