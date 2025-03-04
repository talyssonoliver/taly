# Shared Constants - Taly CRM

This directory contains reusable constants used across the Taly CRM project. Centralizing constants ensures consistency, reduces errors, and improves maintainability.

## 📁 Directory Structure

```
shared/
├── constants/
│   ├── error-messages.ts        # Centralized error messages for all modules
│   ├── success-messages.ts      # Success messages for consistent feedback
│   ├── system-constants.ts      # System-wide configuration and default values
│   ├── ui-constants.ts          # UI-specific constants for theming and layouts
│   ├── index.ts                 # Centralized exports for easier imports
│   └── README.md                # Documentation for shared constants
```

## 🛠️ Available Constants

### `ErrorMessages`

- **Authentication Errors:** Unauthorized, invalid credentials, session expired.
- **Validation Errors:** Required fields, invalid formats, length constraints.
- **Server Errors:** Internal server errors, not found, service unavailable.
- **Domain-Specific Errors:** Booking and payment-related error messages.

### `SuccessMessages`

- **Authentication:** Successful login, logout, registration, and password reset.
- **Bookings:** Confirmation, updates, and cancellations.
- **Payments:** Processing, refunds, and payment method updates.
- **Notifications:** Email, SMS, and push notifications sent successfully.

### `SystemConstants`

- **Pagination:** Default page size, max page size, and page number.
- **Timeouts and Caching:** API timeout and cache TTL.
- **Currency and Locale:** Defaults to GBP and en-GB.
- **Feature Flags:** Logging and maintenance mode toggles.
- **API Limits:** Rate limiting configurations.
- **Authentication:** JWT cookie settings.
- **File Uploads:** Max file size and allowed file types.

### `UIConstants`

- **Themes and Layouts:** Default theme, available themes, and supported layouts.
- **Typography and Colors:** Centralized access to fonts and colors from `theme.ts`.
- **UI Elements:** Button variants, modal settings, and animation durations.
- **Toast Notifications:** Default duration and position settings.

## 🚀 Best Practices

- **Use Centralized Constants:** Avoid hardcoding strings or values directly in components or services.
- **Leverage TypeScript Types:** When accessing constants, use type-safe methods where possible.
- **Keep Constants Up-to-Date:** Regularly review and update constants as new features are added.

## 📚 Example Usage

```typescript
import {
  ErrorMessages,
  SuccessMessages,
  SystemConstants,
  UIConstants,
} from "shared/constants";

console.log(ErrorMessages.VALIDATION.REQUIRED_FIELD);
console.log(SuccessMessages.PAYMENTS.PAYMENT_PROCESSED);

const apiTimeout = SystemConstants.API_TIMEOUT;
const buttonVariant = UIConstants.BUTTON_VARIANTS.PRIMARY;
```

For any questions or contributions, please refer to the main Taly CRM documentation or contact the development team.
