const isDevelopment = process.env.NODE_ENV === "development";
const isStaging = process.env.NODE_ENV === "staging";
const isProduction = process.env.NODE_ENV === "production";

// Logging Levels
export type LogLevel = "info" | "warn" | "error" | "debug";

export const SystemConstants = {
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_NUMBER: 1,

  // Timeouts
  API_TIMEOUT: isProduction ? 10000 : 5000, // Longer timeout in production
  CACHE_TTL: 3600, // Cache Time-to-Live in seconds

  // Currency and Locale
  DEFAULT_CURRENCY: "GBP",
  DEFAULT_LOCALE: "en-GB",

  // Feature Flags
  ENABLE_LOGGING: process.env.ENABLE_LOGGING === "true" && !isProduction,
  ENABLE_MAINTENANCE_MODE: process.env.ENABLE_MAINTENANCE_MODE === "true",

  // UI Settings
  DEFAULT_THEME: "light",
  AVAILABLE_THEMES: ["light", "dark"],
  SUPPORTED_LANGUAGES: ["en", "es", "fr", "pt"],

  // File Uploads
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/png", "application/pdf"],

  // Security
  PASSWORD_MIN_LENGTH: 8,
  JWT_EXPIRATION_TIME: "3600s",
  BCRYPT_SALT_ROUNDS: 10,

  // API Limits
  RATE_LIMIT_REQUESTS_PER_MINUTE: 100,
  RATE_LIMIT_WINDOW_MINUTES: 15,

  // Default Paths and URLs
  ASSET_BASE_PATH: "/assets",
  DEFAULT_AVATAR_URL: "/assets/images/default-avatar.png",
  API_BASE_URL: process.env.API_BASE_URL || "http://localhost:4000",

  // Date and Time Handling
  DEFAULT_DATE_FORMAT: "DD/MM/YYYY",
  DEFAULT_TIMEZONE: "Europe/London",

  // Authentication Settings
  JWT_COOKIE_NAME: "taly_auth_token",
  JWT_COOKIE_SECURE: isProduction,

  // Toast Notifications
  TOAST_DEFAULT_DURATION: 5000, // 5 seconds
  TOAST_POSITION: "top-right",

  // Logging
  LOG_LEVEL: (process.env.LOG_LEVEL as LogLevel) || "info",
};
