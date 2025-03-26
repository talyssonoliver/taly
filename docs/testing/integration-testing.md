```md
# Integration Testing Guide – Taly CRM

This guide explains how to write and run integration tests across the Taly CRM project. Integration tests validate that **multiple modules work together**, typically including service + controller or database + API flows. They are slower than unit tests but essential for system correctness.

---

## 1. What Is an Integration Test?

Integration tests verify:

- End-to-end logic inside the app (but not through HTTP)
- Controller + Service + Repository working as a whole
- Real database queries (via test DB or transaction-based)

Not covered:

- Frontend DOM behavior (covered by unit or E2E tests)
- HTTP endpoint behavior (use E2E instead)

---

## 2. When to Write Integration Tests

| Use Case                          | Write Integration Test? |
|----------------------------------|--------------------------|
| Validating business logic chains | ✅ Yes                   |
| Testing Prisma queries           | ✅ Yes                   |
| Auth flows with token issuing    | ✅ Yes                   |
| UI logic only                    | ❌ No                    |
| Single pure function             | ❌ Use unit test         |

---

## 3. Folder & File Structure

| Location                              | Purpose                           |
|---------------------------------------|-----------------------------------|
| `api/src/**/*.spec.ts`               | Integration/unit tests            |
| `tests/integration/` (optional future) | Central test integration folder   |
| `test/setup.ts`                      | Shared test setup logic           |

---

## 4. Running Integration Tests

```bash
pnpm run test
```

Or with watch:

```bash
pnpm run test:watch
```

> All integration tests must include `.spec.ts` suffix to be picked up.

---

## 5. Database Setup

Tests run against a **local PostgreSQL container** or **transaction-wrapped test DB** using Prisma.

### Best Practice:

- Use Prisma’s `transaction()` to isolate each test
- Alternatively, spin up an ephemeral in-memory database for test runs

### Test Config Example:

```ts
beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE appointments CASCADE`;
});
```

> Avoid using production `.env` values in integration tests.

---

## 6. NestJS Integration Test Example

```ts
describe('AppointmentsService (integration)', () => {
  let service: AppointmentsService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppointmentsModule, DatabaseModule],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create and retrieve an appointment', async () => {
    const salon = await prisma.salon.create({
      data: { name: 'Test Salon' },
    });

    const result = await service.create({
      salonId: salon.id,
      serviceId: 'uuid',
      userId: 'uuid',
      startTime: new Date(),
      endTime: new Date(),
      price: 20,
    });

    expect(result).toHaveProperty('id');
    expect(result.status).toBe('SCHEDULED');
  });
});
```

---

## 7. Common Patterns

### Use Factories

```ts
const user = await createTestUser({ role: 'ADMIN' });
const salon = await createTestSalon();
```

Place in `test/factories/*.ts`.

---

### Reset State Per Test

```ts
afterEach(async () => {
  await prisma.appointment.deleteMany({});
});
```

---

### Mock External Services

Use manual mocks or `jest.spyOn()` to avoid real API calls:

```ts
jest.spyOn(notificationService, 'sendEmail').mockResolvedValue(true);
```

---

## 8. Best Practices

- Don’t test 3rd-party libraries (e.g. Stripe SDK)
- Use test-specific DB or schema
- Run tests in parallel only if data is isolated
- Never commit `.env.test.local` with secrets

---

## 9. CI Integration

Integration tests run in GitHub Actions:

```yaml
- name: Run Tests
  run: pnpm run test
```

Database service is started via:

```yaml
services:
  postgres:
    image: postgres:13
    env:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: Taly
```

---

## 10. Tooling Reference

| Package        | Purpose                       |
|----------------|-------------------------------|
| `jest`         | Test runner                   |
| `@nestjs/testing` | Integration setup for NestJS |
| `ts-jest`      | TS support for Jest           |
| `supertest`    | Only for E2E (not integration)|
| `prisma`       | DB transactions + teardown    |

---

## 11. Related Files

| File                          | Purpose                             |
|-------------------------------|-------------------------------------|
| `test/setup.ts`               | Global test setup, env, teardown    |
| `api/src/**/*.spec.ts`        | Main integration test files         |
| `jest.config.js`              | Jest test runner configuration      |
| `test/factories/`             | Reusable test entity generators     |

---

## 12. Questions?

- Slack: `#taly-qa`
- Email: `qa@taly.dev`

---
```