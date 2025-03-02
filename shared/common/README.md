# Shared Common Utilities - Taly CRM

This directory contains reusable utility functions, error classes, and helpers used across the Taly CRM project. The goal is to promote code reusability, maintainability, and consistency throughout the application.

## 📁 Directory Structure

```
shared/
├── common/
│   ├── errors/
│   │   ├── not-found.error.ts       # 404 Not Found error handling
│   │   ├── unauthorized.error.ts    # 401 Unauthorized error handling with toast notifications
│   │   ├── validation.error.ts      # Validation error handling for Zod schemas
│   │   └── server-500.error.ts      # 500 Internal Server error with toast notifications
│   │
│   ├── helpers/
│   │   ├── date.helper.ts           # Date formatting and calculations
│   │   ├── number.helper.ts         # Number formatting, rounding, and random generation
│   │   └── string.helper.ts         # String manipulation utilities
│   │
│   └── README.md                    # Documentation for shared common utilities
└──
```

## 🚨 Error Handling

### `NotFoundError`

- Represents a 404 Not Found error.
- Typically used for resource or page not found scenarios.
- Example:

```typescript
throw new NotFoundError("User not found");
```

### `UnauthorizedError`

- Represents a 401 Unauthorized error.
- Shows a toast notification and redirects to the login page if needed.
- Example:

```typescript
throw new UnauthorizedError("You must be logged in to access this page");
```

### `ValidationError`

- Integrates with Zod validation to automatically show validation issues via toast.
- Converts `ZodError` to a consistent application error.
- Example:

```typescript
import { ValidationError } from "../errors/validation.error";
import { UserSchema } from "../../validation/schemas/user.schema";

try {
  UserSchema.parse(userData);
} catch (error) {
  if (error instanceof ZodError) {
    throw ValidationError.fromZodError(error);
  }
}
```

### `ServerError`

- Represents a 500 Internal Server Error.
- Automatically triggers a toast notification with a generic error message.
- Example:

```typescript
throw new ServerError("An unexpected error occurred");
```

## 🔨 Helper Functions

### `DateHelper`

- **formatDate:** Converts dates to a human-readable format.
- **getCurrentDateISO:** Returns the current date as an ISO string.
- **daysBetween:** Calculates the number of days between two dates.

### `NumberHelper`

- **formatCurrency:** Formats numbers as currency strings (default to GBP and en-GB locale).
- **round:** Rounds numbers to specified decimal places.
- **random:** Generates random numbers within a defined range.

### `StringHelper`

- **capitalizeFirstLetter:** Capitalizes the first letter of a string.
- **toKebabCase:** Converts strings to kebab-case.
- **truncate:** Trims strings to a max length with ellipsis.
- **toSlug:** Converts strings to a URL-friendly slug format.

## 📚 Best Practices

- Always use centralized helper functions to avoid code duplication.
- Use error classes to provide consistent error handling across the application.
- Utilize toast notifications strategically to improve user experience.

## 🚀 Future Improvements

- Add more utility functions as needed, such as array and object helpers.
- Expand validation schemas with more complex data structures.

For any questions or contributions, please refer to the main Taly CRM documentation or contact the development team.
