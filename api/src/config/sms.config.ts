import { registerAs } from '@nestjs/config';

export const smsConfig = registerAs('sms', () => ({
  provider: process.env.SMS_PROVIDER || 'twilio',
  accountSid: process.env.TWILIO_ACCOUNT_SID || 'your-account-sid',
  authToken: process.env.TWILIO_AUTH_TOKEN || 'your-auth-token',
  phoneNumber: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
}));
