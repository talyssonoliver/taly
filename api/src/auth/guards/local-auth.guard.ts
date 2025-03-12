import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger(LocalAuthGuard.name);

  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.error(
        Authentication failed: ,
      );
      throw err || new Error('Authentication failed');
    }
    return user;
  }
}
