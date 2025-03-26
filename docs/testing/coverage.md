```md
# Code Coverage Strategy – Taly CRM

This document outlines the standards, tools, and policies for measuring and enforcing test coverage in the Taly CRM platform. It applies to all backend (NestJS), frontend (Next.js), and shared packages.

---

## 1. Purpose

Code coverage helps us:

- Validate critical paths are tested
- Prevent regressions in business logic
- Identify dead or unreachable code
- Track test quality and completeness

> **Note**: High coverage does not guarantee correctness, but low coverage guarantees risk.

---

## 2. Tooling

| Stack     | Tool             | Config File               |
|-----------|------------------|---------------------------|
| Backend   | Jest + ts-jest   | `jest.config.js`          |
| Frontend  | Jest + React Testing Library | `jest.config.js` |
| CI        | GitHub Actions   | `ci.yml`                  |
| Report    | `coverage/` folder | HTML + lcov + text summary |

---

## 3. Coverage Thresholds

These thresholds are enforced globally:

| Metric      | Minimum |
|-------------|---------|
| Statements  | 70%     |
| Branches    | 65%     |
| Functions   | 70%     |
| Lines       | 70%     |

Set in `jest.config.js`:

```ts
coverageThreshold: {
  global: {
    statements: 70,
    branches: 65,
    functions: 70,
    lines: 70,
  },
}
```

---

## 4. Running Coverage Locally

### Backend

```bash
pnpm run test:cov
```

Outputs:
- Text summary in terminal
- Detailed HTML report in `/coverage/lcov-report/index.html`

### Frontend

```bash
cd apps/dashboard
pnpm run test:coverage
```

---

## 5. Interpreting Coverage

- **High % but no assertions** → likely fake/empty tests
- **Missing branches** → conditionals not tested (e.g. `if/else`)
- **Low lines %** → code exists but is never executed
- **Low function %** → function defined but not invoked

---

## 6. CI Integration

All CI workflows (`ci.yml`, `frontend-ci.yml`, `backend-ci.yml`) run with coverage enabled.

- Pull requests will fail if coverage drops below thresholds
- Codeowners or reviewers must approve any ignored files

---

## 7. Ignoring Files (Rare)

Avoid ignoring coverage unless strictly necessary.

If needed:

```ts
/* istanbul ignore file */
// or
/* istanbul ignore next */
```

Use sparingly on:
- External API wrappers
- Low-level mocks
- Legacy transitional modules

---

## 8. Frontend Considerations

- Prefer testing logic via hooks or shared utils
- UI rendering coverage ≠ logic coverage
- Coverage is lower in pages with server components (SSR)

---

## 9. Increasing Coverage

| Tip                                    | Description                         |
|----------------------------------------|-------------------------------------|
| Test edge cases                        | Empty lists, null values, etc.      |
| Test RBAC guards                       | Validate 403s for restricted roles  |
| Mock backend failures                  | Ensure error branches are triggered |
| Test validation errors (Zod/class-validator) | Simulate bad input         |

---

## 10. Related Files

| File                                | Purpose                       |
|-------------------------------------|-------------------------------|
| `jest.config.js`                    | Global Jest config            |
| `apps/dashboard/jest.config.js`     | Frontend config               |
| `api/src/**/*.spec.ts`              | Backend unit/integration tests |
| `apps/dashboard/__tests__/**/*.test.tsx` | Frontend unit tests      |

---

## 11. Questions?

- Slack: `#taly-qa`
- Email: `qa@taly.dev`

---
```
