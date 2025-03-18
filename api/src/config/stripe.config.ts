import { registerAs } from '@nestjs/config';

export const stripeConfig = registerAs('stripe', () => ({
  secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_your_key',
  publicKey: process.env.STRIPE_PUBLIC_KEY || 'pk_test_your_key',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your_key',
  currency: process.env.STRIPE_CURRENCY || 'gbp',
}));
