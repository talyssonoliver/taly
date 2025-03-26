Here is the complete content for the documentation file:

---

**`Path: docs/testing/e2e-tests.md`**

```md
# End-to-End (E2E) Testing Guide – Taly CRM

This guide explains how to write and run **end-to-end (E2E) tests** for the Taly CRM platform. E2E tests simulate **real user flows across the entire stack**, verifying that services, authentication, data persistence, and UI interactions work together correctly.

---

## 1. What is E2E Testing?

End-to-end tests:

- Run against real HTTP endpoints (e.g., `localhost:4000/api`)
- Simulate user actions such as:
  - Register → Login → Book → Pay → Cancel
- Cover full stack (frontend/backend/database)

---

## 2. When to Use E2E Tests

| Scenario                                     | Use E2E Test? |
|---------------------------------------------|---------------|
| Full user journey                           | ✅ Yes        |
| Auth token and role-based access            | ✅ Yes        |
| GraphQL + REST endpoint validation          | ✅ Yes        |
| UI visual feedback (e.g., toast, loading)   | ❌ No – Use unit test |
| Component rendering                         | ❌ No – Use frontend unit test |

---

## 3. Project Structure

E2E test files should live in:

```
tests/e2e/
├── auth.e2e.spec.ts
├── booking.e2e.spec.ts
├── payments.e2e.spec.ts
├── reports.e2e.spec.ts
├── shared/
└── setup.ts
```

> Naming convention: `*.e2e.spec.ts`

---

## 4. Tooling

| Tool         | Purpose                        |
|--------------|--------------------------------|
| `jest`       | Test runner                    |
| `supertest`  | HTTP request simulation        |
| `ts-jest`    | TypeScript support             |
| `@nestjs/testing` | NestJS context/DI bootstrapping |
| `prisma`     | Database seeding and teardown  |

---

## 5. Running E2E Tests

From the root of the project:

```bash
pnpm run test:e2e
```

This runs all files matching `*.e2e.spec.ts`.

---

## 6. Example: Auth Flow

```ts
describe('Auth E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should register and login', async () => {
    const email = 'test@example.com';
    const password = 'test123';

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password, firstName: 'Test', lastName: 'User' })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })
      .expect(200);

    expect(loginResponse.body.accessToken).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
```

---

## 7. Sample Flows to Cover

| Flow                       | File                          |
|----------------------------|-------------------------------|
| Register → Login           | `auth.e2e.spec.ts`            |
| Create Booking             | `booking.e2e.spec.ts`         |
| Cancel / Reschedule        | `booking.e2e.spec.ts`         |
| Apply Payment via Stripe   | `payments.e2e.spec.ts`        |
| Create / Export Report     | `reports.e2e.spec.ts`         |

---

## 8. Best Practices

- Use `beforeAll()` to bootstrap `AppModule`
- Use `afterAll()` to close app and reset state
- Clean up DB with Prisma between tests:
  ```ts
  await prisma.appointment.deleteMany({});
  ```
- Chain login → token → request with `Authorization` header

---

## 9. Headers & Auth Helpers

### Helper Example (shared/test-utils.ts)

```ts
export async function loginAndGetToken(app: INestApplication, email: string, password: string) {
  const res = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email, password });

  return res.body.accessToken;
}
```

### Use in Test:

```ts
const token = await loginAndGetToken(app, email, password);

await request(app.getHttpServer())
  .get('/api/appointments')
  .set('Authorization', `Bearer ${token}`)
  .expect(200);
```

---

## 10. CI Integration

E2E tests are triggered via:

```
.github/workflows/nightly-build.yml
```

And optionally on PRs:
```yaml
- name: E2E Tests
  run: pnpm run test:e2e
```

---

## 11. Troubleshooting

| Problem                         | Solution                             |
|----------------------------------|--------------------------------------|
| `ECONNREFUSED` or timeout        | Ensure backend is running locally    |
| `401 Unauthorized`              | Use correct JWT in Authorization     |
| Data not persisted between tests | Use isolated transactions or truncate |
| Test fails on CI only           | Use `console.log()` to trace failures |

---

## 12. Related Files

| File                           | Purpose                   |
|--------------------------------|---------------------------|
| `tests/e2e/*.e2e.spec.ts`      | Main E2E specs            |
| `tests/setup.ts`               | Bootstraps NestJS for E2E |
| `test-utils.ts`                | Reusable login/token helpers |
| `jest-e2e.json`                | Jest config for E2E tests |
| `prisma`                       | Handles DB seeding        |

---

## 13. Questions?

- Slack: `#taly-qa`
- Email: `qa@taly.dev`

---
```

All core test documentation is now available. Would you like `docs/testing/coverage.md` or anything else next (e.g., monitoring, notifications, onboarding for designers)?