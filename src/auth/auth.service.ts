import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

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
      username: user.name, // TODO: check if needed
      email: user.email, // TODO: check if needed
      ...token,
    };
  }

  private _createToken(payload: any) {
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '60m' }), // TODO: check if expiresIn needed
      // expiresIn: '60m' // TODO: check if needed
    };
  }
}
