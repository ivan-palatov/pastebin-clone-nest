import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService, Provider } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  logger = new Logger(GoogleStrategy.name);

  constructor(private readonly authService: AuthService) {
    super({
      clientID:
        '623454996631-lu9soj8vjuid550dt9k12ru627tu2veg.apps.googleusercontent.com',
      clientSecret: 'Hed2m_q-1KzQh21ffccFToCq',
      callbackURL: 'http://localhost:4000/api/auth/google/callback',
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    try {
      this.logger.debug('Profile');
      this.logger.debug(profile);

      this.logger.debug('accessToken');
      this.logger.debug(accessToken);
      this.logger.debug('refreshToken');
      this.logger.debug(refreshToken);

      const user = await this.authService.validateOAuthLogin(
        profile,
        Provider.GOOGLE,
      );

      done(null, user);
    } catch (err) {
      this.logger.error(err);
      done(err, false);
    }
  }
}
