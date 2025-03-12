/**
 * Default pagination values for website listing
 */
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_NUMBER = 1;

/**
 * Website limits by subscription tier
 */
export const WEBSITE_LIMITS = {
  FREE: 1,
  BASIC: 3,
  PROFESSIONAL: 10,
  ENTERPRISE: 50,
};

/**
 * Website status enum
 */
export const WEBSITE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  MAINTENANCE: 'maintenance',
  BUILDING: 'building',
};

/**
 * Allowed top-level domains for custom domains
 */
export const ALLOWED_DOMAINS = [
  '.com',
  '.net',
  '.org',
  '.io',
  '.co',
  '.app',
  '.dev',
  '.site',
  '.me',
  '.us',
];

/**
 * Reserved slugs that cannot be used for pages
 */
export const RESTRICTED_SLUGS = [
  'admin',
  'api',
  'login',
  'register',
  'dashboard',
  'settings',
  'billing',
  'account',
  'profile',
  'auth',
  'app',
  'static',
  'media',
  'robots.txt',
  'sitemap.xml',
  'favicon.ico',
];

/**
 * Maximum number of pages per website tier
 */
export const PAGE_LIMITS = {
  FREE: 5,
  BASIC: 20,
  PROFESSIONAL: 100,
  ENTERPRISE: 500,
};

/**
 * Website builder configuration
 */
export const BUILDER_CONFIG = {
  maxImageSize: 5 * 1024 * 1024, // 5MB
  maxImagesPerWebsite: 100,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  maxCustomCssSize: 100 * 1024, // 100KB
  maxCustomJsSize: 100 * 1024, // 100KB
};
