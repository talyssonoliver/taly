export const NotificationServiceConfig = {
  apiBaseUrl:
    process.env.NOTIFICATION_SERVICE_API_URL || "http://localhost:4005",
  defaultTimeout: Number.parseInt(
    process.env.NOTIFICATION_SERVICE_TIMEOUT || "5000",
    10
  ), // Default timeout 5 seconds
  maxRetries: Number.parseInt(
    process.env.NOTIFICATION_SERVICE_MAX_RETRIES || "3",
    10
  ),

  // Email Service Configuration
  emailApiKey: process.env.MAIL_SERVICE_API_KEY || "",
  emailFromAddress: process.env.MAIL_SERVICE_FROM || "no-reply@taly.dev",

  // SMS Service Configuration
  smsProviderUrl: process.env.SMS_PROVIDER_URL || "",
  smsApiKey: process.env.SMS_API_KEY || "",
  // Push Notifications
  pushServiceUrl: process.env.PUSH_SERVICE_URL || "",
  pushApiKey: process.env.PUSH_API_KEY || "",

  // Feature Flags
  enableEmailNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS === "true",
  enableSmsNotifications: process.env.ENABLE_SMS_NOTIFICATIONS === "true",
  enablePushNotifications: process.env.ENABLE_PUSH_NOTIFICATIONS === "true",
};

// Ensure critical environment variables are set
if (!NotificationServiceConfig.emailApiKey) {
  console.warn(
    "MAIL_SERVICE_API_KEY is not set. Email notifications may not work properly."
  );
}

if (!NotificationServiceConfig.smsApiKey) {
  console.warn(
    "SMS_API_KEY is not set. SMS notifications may not work properly."
  );
}

if (!NotificationServiceConfig.pushApiKey) {
  console.warn(
    "PUSH_API_KEY is not set. Push notifications may not work properly."
  );
}
