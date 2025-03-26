Here is the complete content for the documentation file:

---

**`Path: docs/architecture/code-style.md`**

```md
# Code Style Guide – Taly CRM

This document defines the code style standards for the Taly CRM project. It ensures consistency across frontend, backend, shared libraries, tests, and documentation. All contributors must follow this guide for readability, maintainability, and scalability.

---

## 1. General Guidelines

- Use **British English** for naming variables, functions, and documentation.
- Use **TypeScript** across all apps and packages.
- Prefer **explicitness over cleverness**.
- Keep functions pure unless explicitly side-effecting.
- Write self-documenting code (clear naming > comments).
- Prefer composition over inheritance.

---

## 2. Project Structure & Naming

| Element        | Convention                                  |
|----------------|---------------------------------------------|
| Files          | `kebab-case` (e.g. `user-service.ts`)       |
| Folders        | `kebab-case` (e.g. `shared-ui/hooks/`)      |
| Interfaces     | `PascalCase` with `I` prefix (`IUser`)      |
| Types/Enums    | `PascalCase` (`UserRole`, `AppointmentStatus`) |
| Variables      | `camelCase`                                 |
| Constants      | `UPPER_SNAKE_CASE` (`MAX_ATTEMPTS`)         |
| Functions      | `camelCase`                                 |

---

## 3. TypeScript Rules

- Always use `interface` for object shapes.
- Avoid `any`. Use `unknown` if needed and narrow explicitly.
- Prefer `readonly` for static configs.
- Use return types explicitly on public functions.
- Avoid `!` non-null assertions. Use safe guards.

Example:

```ts
interface IUser {
  id: string;
  fullName: string;
  role: UserRole;
}
```

---

## 4. API Design (Backend)

- Use `@ApiProperty` for all DTO fields (for Swagger).
- Use `@Is*()` decorators from `class-validator`.
- Name DTOs with `*Dto` suffix (e.g. `CreateUserDto`).
- Enum fields must match frontend shared type definitions.

Example DTO:

```ts
export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
```

---

## 5. Frontend Conventions (Next.js)

- Use **App Router** and prefer `server components` when possible.
- Use `Zod` for all form validations.
- Use `React Query` for all API calls.
- Use `Zustand` for shared state (avoid context for global state).
- Prefer `async/await` over `.then()`.

### Imports

Group by type:

```ts
// React, Next.js
import { useEffect } from 'react';

// Third-party
import { z } from 'zod';

// Internal
import { Button } from '@shared-ui/components';
import { useAuthStore } from '@/store/auth';
```

---

## 6. Shared Library Standards

- Shared functions must be **pure and side-effect free**.
- Shared types should be app-agnostic.
- UI components must support dark mode and theming.
- Export only required members from index files.

```ts
// GOOD:
export const formatCurrency = (value: number): string =>
  `£${value.toFixed(2)}`;
```

---

## 7. Testing Standards

- File naming: `*.spec.ts` for backend, `*.test.tsx` for frontend.
- Use `jest.spyOn()` for mocking, not real dependencies.
- All test suites should include:
  - Success case
  - Validation error
  - Unauthorized error (where applicable)

---

## 8. Git & Commit Standards

- Use conventional commits:
  ```
  feat: add appointment reschedule flow
  fix: correct off-by-one date bug in calendar
  chore: update dependencies
  ```

- One commit per logical unit of work.
- Do not commit `.env` or secrets.

---

## 9. Formatting & Linting

- Code is auto-formatted on commit via **Prettier** + **ESLint**.
- Use `pnpm run lint` and `pnpm run format` before every PR.
- Do not disable lint rules unless justified.

---

## 10. Comments & Docs

- Use comments for:
  - Business logic context
  - Non-obvious constraints
- Use JSDoc (`/** ... */`) for shared utilities and public APIs.

Example:

```ts
/**
 * Formats a numeric value into a GBP string.
 * @param value number to format
 */
export function formatCurrency(value: number): string {
  return `£${value.toFixed(2)}`;
}
```

---

## 11. Accessibility (Frontend)

- All interactive elements must have accessible labels.
- Use semantic HTML (`<button>`, `<section>`, `<form>`, etc.).
- Keyboard navigation must be supported.
- Prefer headless components where possible for flexibility.

---

## 12. Do / Don’t Summary

| ✅ Do                                     | ❌ Don’t                             |
|------------------------------------------|--------------------------------------|
| Use TypeScript types + interfaces        | Use `any` or magic strings           |
| Use `zod` for form validation            | Validate manually in JSX            |
| Keep functions under 50 LOC              | Nest multiple complex conditions     |
| Use British English in all code/comments| Mix American and British spelling    |
| Use feature folders for domain modules  | Dump files into `utils/` or `common/` |

---

## 13. Resources

| File | Purpose |
|------|---------|
| `tsconfig.base.json` | TypeScript settings for all packages |
| `.eslintrc.js`       | Linting rules                        |
| `.prettierrc`        | Formatting config                    |
| `jest.config.js`     | Test runner config                   |
| `pnpm-workspace.yaml`| Shared dependency management         |

---

## 14. Questions?

- Reach out via Slack: `#taly-architecture`
- Or email: `engineering@taly.dev`

---
```

Would you like to generate a summary index of all current documentation files (`docs/README.md` or sidebar), or continue with other missing docs like `notification-api.md` or `mailing-strategy.md`?