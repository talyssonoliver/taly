import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { OAuthUser } from '../interfaces/oauth-user.interface';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  private readonly logger = new Logger(FacebookStrategy.name);

  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('FACEBOOK_APP_ID'),
      clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'),
      callbackURL: ${configService.get<string>('API_URL')}/auth/facebook/callback,
      profileFields: ['id', 'emails', 'name'],
      scope: ['email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    try {
      const { id, name, emails } = profile;
      
      const user: OAuthUser = {
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        provider: 'facebook',
        providerId: id,
      };
      
      done(null, user);
    } catch (error) {
      this.logger.error(Facebook validation failed: );
      done(error, null);
    }
  }
}
