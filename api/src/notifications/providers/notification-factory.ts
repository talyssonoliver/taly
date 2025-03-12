import { Injectable } from '@nestjs/common';
import { EmailProvider } from './email.provider';
import { SmsProvider } from './sms.provider';
import { PushProvider } from './push.provider';
import { NotificationType } from '../entities/notification.entity';

@Injectable()
export class NotificationFactory {
  constructor(
    private readonly emailProvider: EmailProvider,
    private readonly smsProvider: SmsProvider,
    private readonly pushProvider: PushProvider,
  ) {}

  /**
   * Get the appropriate notification provider based on notification type
   */
  getProvider(type: string) {
    switch (type) {
      case NotificationType.EMAIL:
        return this.emailProvider;
      case NotificationType.SMS:
        return this.smsProvider;
      case NotificationType.PUSH:
        return this.pushProvider;
      default:
        throw new Error(Unsupported notification type: \);
    }
  }
}
