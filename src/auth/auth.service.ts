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
import { IOAuthUser } from './interfaces/oauth-user.interface';

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

  async validateJwtLogin(payload: IJwtPayload) {
    const user = await this.usersService.findOne({ email: payload.email });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...res } = user;
    return res;
  }

  async validateOAuthLogin(user: IOAuthUser, provider: Provider) {
    try {
      const dbUser = await this.usersService.findOneOrCreate(
        { email: user.email },
        {
          email: user.email,
          name: user.name,
          photo: user.photo,
          password: null,
        },
      );

      return {
        ...dbUser,
        token: this._createToken({
          sub: dbUser.id,
          email: user.email,
          provider,
        }),
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
    if (!user || !user.password) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this._createToken({
      email,
      sub: user.id,
    });

    return {
      name: user.name,
      photo: user.photo,
      email: user.email,
      token,
    };
  }

  private _createToken(payload: any) {
    return this.jwtService.sign(payload);
  }
}
