/**
 * Event names for notification-related events
 */
export enum NotificationEvent {
  NOTIFICATION_SENT = 'notification.sent',
  NOTIFICATION_DELIVERED = 'notification.delivered',
  NOTIFICATION_READ = 'notification.read',
  NOTIFICATION_FAILED = 'notification.failed',
}

/**
 * Notification priority levels
 */
export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Notification categories
 */
export enum NotificationCategory {
  APPOINTMENT = 'appointment',
  PAYMENT = 'payment',
  ACCOUNT = 'account',
  MARKETING = 'marketing',
  SYSTEM = 'system',
  OTHER = 'other',
}

/**
 * Template variable delimiters
 */
export const TEMPLATE_DELIMITERS = {
  HANDLEBARS: ['{{', '}}'],
  MUSTACHE: ['{{', '}}'],
  LIQUID: ['{%', '%}'],
  CUSTOM: [''],
};

/**
 * Maximum retention period for notifications in days
 */
export const MAX_NOTIFICATION_RETENTION_DAYS = 90;

/**
 * Default email sender address
 */
export const DEFAULT_EMAIL_SENDER = 'noreply@example.com';

/**
 * Default SMS sender ID
 */
export const DEFAULT_SMS_SENDER = 'COMPANY';

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  EMAIL: {
    PER_USER_PER_HOUR: 10,
    PER_USER_PER_DAY: 50,
    GLOBAL_PER_MINUTE: 100,
  },
  SMS: {
    PER_USER_PER_HOUR: 5,
    PER_USER_PER_DAY: 10,
    GLOBAL_PER_MINUTE: 50,
  },
  PUSH: {
    PER_USER_PER_HOUR: 20,
    PER_USER_PER_DAY: 100,
    GLOBAL_PER_MINUTE: 200,
  },
};

/**
 * Maximum length for SMS messages
 */
export const MAX_SMS_LENGTH = {
  GSM: 160, // Standard GSM characters
  UNICODE: 70, // Unicode characters
};

/**
 * Notification retry configuration
 */
export const NOTIFICATION_RETRY = {
  MAX_ATTEMPTS: 3,
  BACKOFF_FACTOR: 2, // exponential backoff
  INITIAL_DELAY_MS: 1000,
};
