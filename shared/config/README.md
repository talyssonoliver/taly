# Shared Configuration - Taly CRM

This directory contains configuration files that centralize and manage environment variables, settings, and feature flags used across the Taly CRM project. By centralizing configurations, we ensure consistency and make environment-specific adjustments easier.

## 📁 Directory Structure

```
shared/
├── config/
│   ├── auth.config.ts                # Authentication and OAuth settings
│   ├── booking-service.config.ts     # Configuration for Booking Service integration
│   ├── jwt.config.ts                 # JWT authentication and refresh token settings
│   ├── notification-service.config.ts# Notification service settings for email, SMS, and push notifications
│   └── README.md                     # Documentation for shared configuration files
```

## 🔑 Configuration Files

### `auth.config.ts`

- **Manages authentication settings:**
  - JWT secrets and expiration times.
  - OAuth providers (e.g., Google).
  - NextAuth.js configuration.
- **Environment Variables:**

```env
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION_TIME=3600s
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### `booking-service.config.ts`

- **Booking Service Integration:**
  - API base URL, request timeouts, and retry limits.
  - Integration with Notification Service.
  - Cache settings and feature flags.
- **Example Usage:**

```typescript
import { BookingServiceConfig } from "../../shared/config/booking-service.config";

const apiUrl = BookingServiceConfig.apiBaseUrl;
```

### `jwt.config.ts`

- **JWT and Refresh Tokens:**
  - Manages secrets, expiration times, and algorithms.
  - Supports configuration for both access and refresh tokens.
- **Key Settings:**

```env
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRATION_TIME=3600s
JWT_REFRESH_EXPIRATION_TIME=7d
```

### `notification-service.config.ts`

- **Notification Channels:**
  - Supports Email, SMS, and Push notifications.
  - Manages API keys, feature flags, and provider URLs.
- **Feature Flags:**

```env
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_SMS_NOTIFICATIONS=true
ENABLE_PUSH_NOTIFICATIONS=true
MAIL_SERVICE_API_KEY=your_mail_api_key
SMS_API_KEY=your_sms_api_key
PUSH_API_KEY=your_push_api_key
```

## 🚨 Best Practices

- **Always Use Environment Variables:** Never hardcode sensitive information directly in the code.
- **Use Feature Flags:** Allow easy enabling/disabling of features across environments.
- **Validate Critical Configurations:** Ensure required variables are set and provide meaningful warnings if not.

## 🚀 Future Improvements

- Implement schema validation for configurations (e.g., using Zod).
- Add support for dynamic configurations from external sources (e.g., AWS SSM, HashiCorp Vault).

For additional information or to contribute to the configuration management, refer to the main Taly CRM project documentation or contact the development team.
