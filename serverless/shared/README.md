# Shared Utilities for Serverless Functions

This directory contains shared utilities and resources used across the serverless functions in the **Taly** project. By centralizing common logic and assets, we ensure consistency, reusability, and maintainability of the serverless architecture.

## Directory Structure

```
shared/
├── auth/
│   ├── jwt-helper.ts  # Functions to generate, verify, and decode JWT tokens.
│   ├── roles.guard.ts  # Guard for role-based access control.
│   └── user.decorator.ts  # Decorator for injecting user data into requests.
├── notifications/
│   ├── email-sender.ts  # Function to send emails using a third-party service (e.g., SES, SendGrid).
  │   ├── sms-sender.ts  # Function to send SMS messages.
  │   └── notification-logger.ts  # Utility for logging notifications.
  │       ├── utils/
  │       │   ├── logger.ts  # Centralized logging utility for serverless functions.
  │       │   ├── http-helper.ts  # Utility to create standardized HTTP responses.
  │       │   ├── database.ts  # Helper for establishing database connections.
  │       │   └── event-emitter.ts  # Utility for emitting events to the message broker.
  │       │       ├── constants/
  │       │       │   └── index.ts  # Global constants used across functions.
  │       │       ├── dto/
  │       │       │   ├── base.dto.ts  # Base Data Transfer Object (DTO) for reuse.
  │       │       │   ├── error-response.dto.ts  # Standardized structure for error responses.
  │       │       │   └── paginated-query.dto.ts  # DTO for handling paginated API queries.
  │       │           └── README.md  # Documentation for this directory.
```

## Purpose

The shared directory serves as a repository for common components and utilities that:

1. **Promote Reusability**: Avoid duplicating code across different serverless functions.
2. **Ensure Consistency**: Standardize logic, such as HTTP responses and logging, across the project.
3. **Facilitate Maintenance**: Centralized updates to shared resources simplify code maintenance and improve reliability.

## Key Modules

### `auth/`

- Provides authentication and authorization utilities, including JWT handling and role-based access controls.

### `notifications/`

- Contains utilities for sending and logging notifications (email, SMS) across serverless functions.

### `utils/`

- Includes general-purpose utilities such as logging, database connections, and event emission.

### `constants/`

- Centralized location for global constants, ensuring consistency across serverless functions.

### `dto/`

- Defines reusable data structures for API payloads and responses, adhering to best practices for type safety.

## How to Use

1. **Importing Utilities**:

   - Import shared utilities directly into your serverless function:
     ```typescript
     import { logger } from "../shared/utils/logger";
     import { sendEmail } from "../shared/notifications/email-sender";
     ```

2. **Adding New Utilities**:

   - Create a new file in the appropriate folder (`auth`, `utils`, etc.).
   - Update relevant documentation in this `README.md`.

3. **Updating Constants**:

   - Add or update constants in `constants/index.ts`. Ensure any changes are backward-compatible when possible.

4. **Testing Shared Code**:
   - Write unit tests for shared utilities under the respective function’s test directory to ensure compatibility.

## Contributing Guidelines

- Follow the [project coding guidelines](../../docs/contributing.md) when adding or modifying shared utilities.
- Ensure all shared code is:
  - **Documented**: Add clear comments and usage examples where necessary.
  - **Tested**: Include unit tests for new or updated utilities.

## Additional Notes

- **Versioning**: Major changes to shared utilities may require coordinated updates across all serverless functions.
- **Best Practices**: Ensure shared utilities are lightweight and free of function-specific logic to maintain modularity.

---

For questions or support, contact the **Serverless Team**.
