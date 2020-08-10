import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  Params,
  Profile,
  Strategy,
  StrategyOptions,
  VerifyCallback,
} from 'passport-vkontakte';
import { AuthService, Provider } from '../auth.service';

@Injectable()
export class VkStrategy extends PassportStrategy(Strategy, Provider.VK) {
  logger = new Logger(VkStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('VK_CLIENT_ID'),
      clientSecret: configService.get('VK_CLIENT_SECRET'),
      callbackURL: 'http://localhost:4000/api/auth/vk/callback',
      scope: ['email'],
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    params: Params,
    profile: Profile,
    done: VerifyCallback,
  ) {
    try {
      const vkUser = {
        id: profile.id,
        name: profile.displayName,
        photo: profile.photos?.[0].value,
        email: profile.emails?.[0].value as string,
      };

      const user = await this.authService.validateOAuthLogin(
        vkUser,
        Provider.VK,
      );

      done(null, user);
    } catch (err) {
      this.logger.error(err);
      done(err, false);
    }
  }
}
