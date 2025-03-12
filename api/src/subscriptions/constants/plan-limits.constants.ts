/**
 * Storage limits by plan tier (in GB)
 */
export const STORAGE_LIMITS = {
  FREE: 5,
  BASIC: 20,
  PREMIUM: 100,
  BUSINESS: 500,
  ENTERPRISE: 1000,
};

/**
 * API request limits by plan tier (requests per day)
 */
export const API_REQUEST_LIMITS = {
  FREE: 1000,
  BASIC: 10000,
  PREMIUM: 50000,
  BUSINESS: 200000,
  ENTERPRISE: 1000000,
};

/**
 * User seat limits by plan tier
 */
export const USER_SEAT_LIMITS = {
  FREE: 1,
  BASIC: 5,
  PREMIUM: 20,
  BUSINESS: 50,
  ENTERPRISE: 200,
};

/**
 * Project limits by plan tier
 */
export const PROJECT_LIMITS = {
  FREE: 2,
  BASIC: 10,
  PREMIUM: 25,
  BUSINESS: 50,
  ENTERPRISE: 100,
};

/**
 * Feature availability by plan
 */
export const FEATURE_AVAILABILITY = {
  ADVANCED_ANALYTICS: ['PREMIUM', 'BUSINESS', 'ENTERPRISE'],
  PRIORITY_SUPPORT: ['BUSINESS', 'ENTERPRISE'],
  CUSTOM_DOMAINS: ['PREMIUM', 'BUSINESS', 'ENTERPRISE'],
  WHITE_LABELING: ['BUSINESS', 'ENTERPRISE'],
  SSO_INTEGRATION: ['ENTERPRISE'],
  API_ACCESS: ['BASIC', 'PREMIUM', 'BUSINESS', 'ENTERPRISE'],
};
