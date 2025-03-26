```md
# Shared Libraries Architecture – Taly CRM

This document explains the structure, purpose, and usage of the **shared libraries** within the Taly CRM monorepo. These libraries are designed to **promote code reuse**, ensure consistency across applications, and reduce duplication of logic, types, and UI components.

---

## 1. Overview

Shared libraries are grouped under:

```
/shared/         → Logic, types, services, constants
/shared-ui/      → UI components, hooks, utilities (React)
@shared/*        → Aliased in tsconfig for clean imports
```

These are consumed by apps in `/apps/` such as `dashboard`, `booking`, and `payments`.

---

## 2. Folder Structure

```
shared/
├── constants/         # Shared constants (e.g., currencies, regex)
├── dtos/              # API DTOs (mirrors backend validation)
├── types/             # Shared interfaces and enums
├── utils/             # Pure logic helpers (e.g., formatters)
├── graphql/           # Shared GQL fragments/types
```

```
shared-ui/
├── components/        # Reusable UI components (Button, Modal, etc.)
├── hooks/             # Reusable React hooks (useAuth, usePagination)
├── helpers/           # Client-side logic helpers (formatCurrency, etc.)
├── icons/             # Reusable icon components
├── store/             # Zustand stores shared across apps
├── config/            # Theming, Tailwind config, etc.
```

---

## 3. Importing Shared Libraries

Use workspace aliases for clean and consistent imports:

```ts
import { Button } from '@shared-ui/components';
import { formatCurrency } from '@shared/utils';
import { PaginationMeta } from '@shared/types';
```

> Aliases are defined in:
- `tsconfig.base.json`
- `pnpm-workspace.yaml`

---

## 4. Usage Examples

### Shared Type Example

```ts
// shared/types/pagination.ts
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}
```

Used in:
```ts
const meta: PaginationMeta = { total: 42, page: 1, limit: 10 };
```

---

### Shared UI Component

```tsx
// shared-ui/components/Button.tsx
<Button variant="primary" size="sm">
  Submit
</Button>
```

---

### Shared Hook

```tsx
const { isAuthenticated } = useAuth();
```

---

## 5. Versioning & Stability

- All shared packages follow semantic versioning (`v1`, `v2`, etc.)
- Avoid introducing breaking changes without incrementing major version
- Document shared helpers and types when introduced

---

## 6. Code Style & Conventions

- All shared functions must be **pure** (no side effects)
- Do not include app-specific logic (e.g., booking-only logic in shared)
- Avoid dependencies on frontend-specific frameworks in `shared/`
- Prefer generic names: `usePagination`, `formatDate`, `StatusEnum`

---

## 7. Testing Shared Code

Use Jest for logic in `shared/`:

```ts
describe('formatCurrency', () => {
  it('formats GBP correctly', () => {
    expect(formatCurrency(19.5)).toBe('£19.50');
  });
});
```

Use Testing Library for React components in `shared-ui/`:

```tsx
render(<Button>Click Me</Button>);
expect(screen.getByText('Click Me')).toBeInTheDocument();
```

---

## 8. CI & Linting

- Shared code is linted and tested in every CI build
- Changes to shared modules must not break dependent apps
- CI will report failure if downstream usage is affected

---

## 9. Planned Improvements

| Feature                   | Status  |
|---------------------------|---------|
| `@shared-i18n` for strings | Planned |
| Docs generator for shared types | Planned |
| Central design tokens export | Planned |
| Dark mode-aware components | In progress |

---

## 10. Related Files

| File | Purpose |
|------|---------|
| `tsconfig.base.json` | Path aliases for shared imports |
| `pnpm-workspace.yaml` | Shared library linking |
| `jest.config.js` | Test config for shared packages |
| `shared/types/*.ts` | Global shared data structures |
| `shared-ui/components/*.tsx` | Common UI components |

---

## 11. Questions?

For help with shared libraries, reach out to:

- Slack: `#taly-frontend`
- Email: `frontend@taly.dev`

---
```