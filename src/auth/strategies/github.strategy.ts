import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptions } from 'passport-github';
import { AuthService, Provider } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(
  Strategy,
  Provider.GITHUB,
) {
  logger = new Logger(GithubStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID'),
      clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
      callbackURL: 'http://localhost:4000/api/auth/github/callback',
      scope: ['email'],
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ) {
    const githubUser = {
      id: profile.id,
      name: profile.displayName,
      photo: profile.photos?.[0].value,
      email: profile.emails?.[0].value as string,
    };
    try {
      const user = await this.authService.validateOAuthLogin(
        githubUser,
        Provider.GITHUB,
      );

      done(null, user);
    } catch (err) {
      this.logger.error(err);
      done(err, false);
    }
  }
}
