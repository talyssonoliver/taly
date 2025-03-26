```md
# Unit Testing Guide – Taly CRM

This document provides standards, tooling, and examples for writing **unit tests** across the Taly CRM codebase. It includes backend (NestJS), frontend (React), and shared utility testing practices using **Jest** and **Testing Library**.

---

## 1. Testing Philosophy

Unit tests should:

- Test isolated logic (no DB or network)
- Run fast and reliably
- Assert inputs/outputs, edge cases, and errors
- Not rely on external side effects (e.g., file system, DB)

> Complex workflows should be covered by **integration** and **E2E** tests separately.

---

## 2. Tooling

| Layer     | Tech Stack                    |
|-----------|-------------------------------|
| Backend   | Jest + ts-jest                |
| Frontend  | Jest + @testing-library/react |
| Shared    | Jest                          |
| CI        | GitHub Actions                |

---

## 3. File & Directory Structure

| Type     | Location                                       |
|----------|------------------------------------------------|
| Backend  | `api/src/**/*.spec.ts`                         |
| Frontend | `apps/dashboard/__tests__/**/*.test.tsx`       |
| Shared   | `shared/utils/__tests__/*.spec.ts`             |
| Config   | `jest.config.js`, `setupTests.js`, `tsconfig`  |

---

## 4. Running Unit Tests

From project root:

```bash
pnpm run test
```

Run with coverage:

```bash
pnpm run test:cov
```

---

## 5. Writing Backend Unit Tests (NestJS)

### Setup

Use the NestJS testing module:

```ts
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, MockedUserRepo],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate credentials', async () => {
    const result = await service.validateUser('user@test.com', '123456');
    expect(result.email).toEqual('user@test.com');
  });
});
```

### Mocking

Use manual mocks or libraries like `jest-mock-extended`.

Example:

```ts
jest.spyOn(userRepo, 'findByEmail').mockResolvedValue(mockUser);
```

---

## 6. Writing Frontend Unit Tests (React + Next.js)

### Component Test Example

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
});
```

### Form Validation with Zod

```tsx
test('shows error on empty email', async () => {
  render(<LoginForm />);
  fireEvent.click(screen.getByRole('button'));

  expect(await screen.findByText('Email is required')).toBeInTheDocument();
});
```

---

## 7. Writing Shared Utility Tests

```ts
import { formatCurrency } from '../format.util';

describe('formatCurrency', () => {
  it('formats GBP correctly', () => {
    expect(formatCurrency(10.5)).toBe('£10.50');
  });
});
```

---

## 8. Assertions & Patterns

- Use `toBeDefined()`, `toThrow()`, `toMatchObject()`
- Avoid testing implementation details
- Always cover:
  - Success path
  - Invalid inputs
  - Edge cases
  - Exceptions

---

## 9. Code Coverage

Run:

```bash
pnpm run test:cov
```

Enforces:

| Target       | Minimum Coverage |
|--------------|------------------|
| Branches     | 70%              |
| Functions    | 70%              |
| Lines        | 70%              |
| Statements   | 70%              |

Results stored in `/coverage/`.

---

## 10. CI Integration

GitHub Actions (`ci.yml`) runs tests on every PR:

```yaml
- name: Run Tests
  run: pnpm run test
```

Failing tests block PR merges.

---

## 11. Tips

- Use `jest.clearAllMocks()` in `afterEach`
- Use factories (`test/factories`) for generating mock data
- Don't use real services (Stripe, Prisma, etc.)
- Prefer fast, deterministic tests

---

## 12. Resources

| File | Purpose |
|------|---------|
| `jest.config.js` | Base Jest config |
| `setupTests.js` | Shared test setup |
| `*.spec.ts` | Backend test files |
| `*.test.tsx` | Frontend test files |
| `ts-jest` | TypeScript support for Jest |

---

## 13. Questions?

- Ask in `#taly-qa`
- Contact: `qa@taly.dev`

---
```