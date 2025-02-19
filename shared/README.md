# Shared Utilities and Components

This directory contains shared utilities, components, and styles used across the Taly platform. By centralizing common logic and assets, we ensure consistency, reusability, and maintainability.

## Directory Structure

├── shared/ # Shared libraries and utilities
├── dto/
│ ├── base.dto.ts
│ ├── error-response.dto.ts
│ └── paginated-query.dto.ts
├── utils/
│ ├── logger.ts # Logging function
│ ├── validation.pipe.ts # Pipe for input validation
│ └── date-helper.ts # Helper functions for dates
│ ├── http-helper.ts
│ ├── database.ts
│ └── event-emitter.ts
├── decorators/
│ ├── roles.decorator.ts # Decorator for permission control
│ └── user.decorator.ts # Decorator to inject user into the request
├── guards/
│ ├── jwt-auth.guard.ts # Guard for JWT authentication
│ └── roles.guard.ts # Guard for role-based authorization
├── constants/
│ └── index.ts # Global constants
├── events/
│ └── index.ts # Event contracts for the event bus
├── package.json
├── tsconfig.json
└── README.md

## Purpose

The shared directory serves as a repository for common components and utilities.

## Common

### Helpers

- **date.helper.ts**: Functions for date manipulation.
- **string.helper.ts**: Functions for string manipulation.
- **number.helper.ts**: Functions for number manipulation.

### Errors

- **not-found.error.ts**: Custom error for resource not found.
- **unauthorized.error.ts**: Custom error for unauthorized access.
- **validation.error.ts**: Custom error for validation issues.

### Config

Contains definitions and configurations shared across multiple services.

- **auth.config.ts**: Authentication settings.
- **jwt.config.ts**: Settings for generating and verifying JWT tokens.
- **booking-service.config.ts**: Settings for the booking service.
- **notification-service.config.ts**: Settings for the notification service.
- **payment-service.config.ts**: Settings for the payment service.

### DTO

Contains Data Transfer Objects used among multiple services.

- **create-booking.dto.ts**: DTO for creating bookings.
- **update-booking.dto.ts**: DTO for updating bookings.
- **login.dto.ts**: DTO for login data.
- **refresh-token.dto.ts**: DTO for token renewal data.
- **signup.dto.ts**: DTO for user registration data.
- **create-payment.dto.ts**: DTO for payment creation data.
- **refund-payment.dto.ts**: DTO for payment refund data.

### Events

Contains events used for communication between microservices.

- **booking-notification.event.ts**: Event related to new booking notifications.
- **booking-updated.event.ts**: Event for updates to existing bookings.
- **payment-notification.event.ts**: Event related to payment notifications.
- **payment-created.event.ts**: Event indicating a payment was created.
- **refund-processed.event.ts**: Event indicating a refund was processed.

### Utils

A set of shared utility functions.

- **date-utils.ts**: Helper functions for working with dates.
- **fee-calculator.ts**: Fee calculations for payments.
- **password-hasher.ts**: Password hashing logic.
- **token-generator.ts**: Logic for generating and validating tokens.

## UI

### Components

- **Button.tsx**: Reusable button component.
- **Modal.tsx**: Reusable modal component.
- **Input.tsx**: Reusable input component.
- **Spinner.tsx**: Loading spinner component.

### Styles

- **theme.css**: Shared theme styles.
- **globals.css**: Global styles for the application.

### Validation

Provides additional validation functionality for requests and data.

### Decorators

A set of decorators used for annotating classes, methods, or properties.

### Guard

Mechanisms to protect routes and resources, controlling access to endpoints.

### Interceptors

Intercepts calls to apply additional logic before or after each request/response.

## Usage

To use the shared components and utilities in your project, import them as follows:

```typescript
import { Button } from "@shared-ui/components/Button";
import { dateHelper } from "@shared/common/helpers/date.helper";
```
