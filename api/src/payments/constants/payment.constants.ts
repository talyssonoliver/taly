/**
 * Payment providers supported by the system
 */
export enum PaymentProviders {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  BRAINTREE = 'braintree',
}

/**
 * Payment method types
 */
export enum PaymentMethodTypes {
  CARD = 'card',
  BANK_ACCOUNT = 'bank_account',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  CRYPTO = 'crypto',
}

/**
 * Supported currencies and their decimal precision
 */
export const SUPPORTED_CURRENCIES = {
  USD: { name: 'US Dollar', precision: 2, symbol: '$' },
  EUR: { name: 'Euro', precision: 2, symbol: '€' },
  GBP: { name: 'British Pound', precision: 2, symbol: '£' },
  CAD: { name: 'Canadian Dollar', precision: 2, symbol: 'CA$' },
  AUD: { name: 'Australian Dollar', precision: 2, symbol: 'A$' },
  JPY: { name: 'Japanese Yen', precision: 0, symbol: '¥' },
  CNY: { name: 'Chinese Yuan', precision: 2, symbol: '¥' },
  INR: { name: 'Indian Rupee', precision: 2, symbol: '₹' },
  BRL: { name: 'Brazilian Real', precision: 2, symbol: 'R$' },
  MXN: { name: 'Mexican Peso', precision: 2, symbol: 'MX$' },
};

/**
 * Transaction fee settings
 */
export const TRANSACTION_FEES = {
  STRIPE: {
    percentage: 2.9,
    fixed: 30, // in cents
    internationalPercentage: 3.9,
  },
  PAYPAL: {
    percentage: 3.49,
    fixed: 49, // in cents
    internationalPercentage: 4.49,
  },
  BRAINTREE: {
    percentage: 2.9,
    fixed: 30, // in cents
    internationalPercentage: 3.9,
  },
};

/**
 * Default payment settings
 */
export const DEFAULT_PAYMENT_SETTINGS = {
  statementDescriptor: 'YourCompany',
  statementDescriptorSuffix: null,
  captureMethod: 'automatic',
  savePaymentMethod: false,
};

/**
 * Refund reason codes
 */
export const REFUND_REASONS = [
  'requested_by_customer',
  'duplicate',
  'fraudulent',
  'other',
];

/**
 * Payment webhook events to process
 */
export const WEBHOOK_EVENTS = {
  STRIPE: [
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'payment_intent.canceled',
    'payment_method.attached',
    'payment_method.detached',
    'charge.refunded',
    'charge.dispute.created',
    'charge.dispute.closed',
  ],
  PAYPAL: [
    'PAYMENT.SALE.COMPLETED',
    'PAYMENT.SALE.DENIED',
    'PAYMENT.SALE.REFUNDED',
    'PAYMENT.SALE.REVERSED',
  ],
};

/**
 * Maximum refund period in days
 */
export const MAX_REFUND_PERIOD_DAYS = 180;

/**
 * Default payout schedules (in days)
 */
export const DEFAULT_PAYOUT_SCHEDULE = {
  DAILY: 1,
  WEEKLY: 7,
  MONTHLY: 30,
};

/**
 * Dispute categories
 */
export const DISPUTE_CATEGORIES = [
  'duplicate',
  'fraudulent',
  'subscription_canceled',
  'product_unacceptable',
  'product_not_received',
  'unrecognized',
  'credit_not_processed',
  'general',
];

/**
 * Payment risk levels
 */
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

/**
 * Default payment limits
 */
export const PAYMENT_LIMITS = {
  MIN_AMOUNT: 50, // in cents, $0.50
  MAX_AMOUNT: 99999900, // in cents, $999,999.00
  MAX_DAILY_AMOUNT: 10000000, // in cents, $100,000.00
  MAX_MONTHLY_AMOUNT: 100000000, // in cents, $1,000,000.00
};

/**
 * Payment retry configuration
 */
export const PAYMENT_RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelay: 2000, // in milliseconds
  maxDelay: 10000, // in milliseconds
  factor: 2, // exponential factor
};
