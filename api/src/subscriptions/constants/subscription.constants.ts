/**
 * Subscription status
 */
export enum SubscriptionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  PAUSED = 'paused',
  PAST_DUE = 'past_due',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  TRIAL = 'trial',
}

/**
 * Billing periods
 */
export enum BillingPeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  BIANNUAL = 'biannual',
  ANNUAL = 'annual',
}

/**
 * Subscription events
 */
export enum SubscriptionEvent {
  CREATED = 'subscription.created',
  UPDATED = 'subscription.updated',
  CANCELLED = 'subscription.cancelled',
  PLAN_CHANGED = 'subscription.plan_changed',
  PAYMENT_SUCCEEDED = 'subscription.payment_succeeded',
  PAYMENT_FAILED = 'subscription.payment_failed',
  RENEWED = 'subscription.renewed',
  EXPIRED = 'subscription.expired',
  TRIAL_STARTED = 'subscription.trial_started',
  TRIAL_ENDED = 'subscription.trial_ended',
}

/**
 * Default trial period in days
 */
export const DEFAULT_TRIAL_DAYS = 14;

/**
 * Grace period in days for past due subscriptions before cancellation
 */
export const PAYMENT_GRACE_PERIOD_DAYS = 3;

/**
 * Maximum number of allowed subscriptions per user
 */
export const MAX_SUBSCRIPTIONS_PER_USER = 5;
