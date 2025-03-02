export const BookingServiceConfig = {
  apiBaseUrl: process.env.BOOKING_SERVICE_API_URL || "http://localhost:4002",
  defaultTimeout: Number.parseInt(
    process.env.BOOKING_SERVICE_TIMEOUT || "5000",
    10
  ),
  maxRetries: Number.parseInt(
    process.env.BOOKING_SERVICE_MAX_RETRIES || "3",
    10
  ),

  notificationServiceUrl:
    process.env.NOTIFICATION_SERVICE_URL || "http://localhost:4005",

  // Cache Configuration
  cacheTTL: Number.parseInt(process.env.BOOKING_CACHE_TTL || "3600", 10), // Cache Time-to-Live in seconds

  // Feature Flags
  enableAutoConfirm: process.env.ENABLE_AUTO_CONFIRM === "true",
  enableWaitlist: process.env.ENABLE_WAITLIST === "true",
};

// Ensure important environment variables are set
if (!BookingServiceConfig.apiBaseUrl) {
  console.warn("BOOKING_SERVICE_API_URL is not set. Using default URL.");
}

if (!BookingServiceConfig.notificationServiceUrl) {
  console.warn(
    "NOTIFICATION_SERVICE_URL is not set. Notifications may not work properly."
  );
}
