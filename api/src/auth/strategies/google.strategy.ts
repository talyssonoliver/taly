import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { OAuthUser } from '../interfaces/oauth-user.interface';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(private readonly configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    
    if (!clientID || !clientSecret) {
      throw new Error('Google OAuth credentials are not properly configured');
    }
    
    super({
      clientID,
      clientSecret,
      callbackURL: `${configService.get<string>('API_URL')}/auth/google/callback`,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    _req: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const { id, name, emails, photos } = profile;
      
      if (!emails || emails.length === 0) {
        throw new Error('Email information not provided by Google');
      }
      
      const user: OAuthUser = {
        email: emails[0].value,
        firstName: name?.givenName || '',
        lastName: name?.familyName || '',
        provider: 'google',
        providerId: id,
        photo: photos?.[0]?.value || undefined,
      };
      
      done(null, user);
    } catch (error) {
      this.logger.error(`Google validation failed: ${error.message}`, error.stack);
      done(error, undefined);
    }
  }
}