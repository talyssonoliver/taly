import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OAuthGuard extends AuthGuard(['facebook', 'google']) {
  private readonly logger = new Logger(OAuthGuard.name);

  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const provider = this.getProviderFromUrl(request.url);
    
    if (provider) {
      return (await super.getAuthenticateOptions(context)).map(options => {
        options.authInfo = { provider };
        return options;
      }) && (await super.canActivate(context));
    }
    
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.error(
        OAuth authentication failed: ,
      );
      throw err || new Error('Authentication failed');
    }
    return user;
  }

  private getProviderFromUrl(url: string): string | null {
    if (url.includes('/facebook')) {
      return 'facebook';
    } else if (url.includes('/google')) {
      return 'google';
    }
    return null;
  }
}
