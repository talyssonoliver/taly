```md
# Code Review Checklist – Taly CRM

This document defines the review criteria all contributors and maintainers should follow when reviewing pull requests (PRs) in the Taly CRM project. The goal is to ensure code quality, consistency, performance, accessibility, and security.

---

## 1. General Checklist

✅ All checkboxes **must** be verified before merging a PR.

| Item | Description |
|------|-------------|
| [ ] Clear title and description | PR name and body explain what is being changed |
| [ ] Atomic changes | PR focuses on a single unit of functionality |
| [ ] Linked issue/task | Related Jira/Trello or GitHub issue is referenced |
| [ ] No commented-out code | Dead or legacy code is removed |
| [ ] English-only | Code, comments, and commit messages use British English |

---

## 2. Code Style & Structure

| Item | Description |
|------|-------------|
| [ ] Naming is clear and consistent | Variables, functions, and types follow naming conventions |
| [ ] Uses existing shared utils/types | No duplicated logic or definitions |
| [ ] File is in the correct directory | Respects monorepo structure (e.g. domain-driven folders) |
| [ ] No unnecessary console.logs | All debug prints are removed or gated by `NODE_ENV` |

---

## 3. TypeScript & Validation

| Item | Description |
|------|-------------|
| [ ] No usage of `any` | Use proper interfaces, `unknown`, or safe fallback types |
| [ ] All external data validated | REST/GraphQL responses are parsed with Zod or class-validator |
| [ ] Functions have return types | Public services, API handlers, and utilities explicitly typed |

---

## 4. Frontend (React / Next.js)

| Item | Description |
|------|-------------|
| [ ] Component is reusable and isolated | No side effects inside presentation components |
| [ ] Form fields use Zod + toast feedback | Validated with visual user feedback |
| [ ] Axios call uses shared instance | Error handling and retry logic are standardised |
| [ ] Responsive design tested | Works on mobile, tablet, and desktop breakpoints |
| [ ] Accessible | Includes alt text, aria-labels, keyboard nav support |

---

## 5. Backend (NestJS)

| Item | Description |
|------|-------------|
| [ ] Uses DTOs with validation decorators | `@IsString()`, `@ApiProperty()`, etc. present |
| [ ] RBAC enforced | `@Roles()` + `JwtAuthGuard` and `RolesGuard` in protected routes |
| [ ] Database access is abstracted | Queries go through service/repository, not directly in controller |
| [ ] Pagination and filtering supported | `GET /entities` endpoints accept `page`, `limit`, `filter` params |

---

## 6. Tests

| Item | Description |
|------|-------------|
| [ ] Unit tests cover new logic | All service/utility logic is covered with `.spec.ts` or `.test.tsx` |
| [ ] E2E tested if applicable | User flow changes are validated in integration or E2E suites |
| [ ] Test names are descriptive | It’s clear what each test is asserting |
| [ ] Tests are deterministic | No date/time/random failures or test pollution |

---

## 7. Documentation & Developer Experience

| Item | Description |
|------|-------------|
| [ ] README or MD updated if needed | New features, services, or patterns are documented |
| [ ] Comments clarify complex logic | Any non-obvious flow is briefly documented in code |
| [ ] Lint passes | `pnpm run lint` runs clean |
| [ ] Code is formatted | `pnpm run format` (Prettier) run before commit |

---

## 8. CI & Build

| Item | Description |
|------|-------------|
| [ ] PR passes all CI checks | Test, lint, and build must succeed |
| [ ] No snapshot regression | Visual snapshots (if any) match previous runs |
| [ ] Build size and perf are reasonable | No large asset increase, bundle bloat, or memory leak risk |

---

## 9. Security & Compliance

| Item | Description |
|------|-------------|
| [ ] Secrets are not committed | No `.env`, keys, or tokens exposed in code or logs |
| [ ] Input is validated | Prevents XSS, SQL injection, mass assignment, etc. |
| [ ] Sensitive actions are logged | User permission changes, payments, or cancellations tracked |
| [ ] Tokens and auth flows are secure | Follows best practices (JWT expiration, refresh flow, RBAC) |

---

## 10. Merge Rules

| Rule | Condition |
|------|-----------|
| ✅  | All required checks pass |
| ✅  | 1–2 team members have approved |
| ✅  | Any blocking comments are resolved |
| ❌  | Do not merge failing CI / incomplete PRs |
| ❌  | Do not squash PRs without maintaining changelog-friendly messages |

---

## 11. Questions?

- Slack: `#taly-reviews`
- GitHub: @review-team
- Email: `engineering@taly.dev`

---
```
