```md
# Backend Service Guide

This guide helps you understand how to run, debug, test, and contribute to the Taly CRM backend, which is built with **NestJS**, **Prisma**, **GraphQL**, **Swagger**, and follows **Clean Architecture** principles.

---

## Overview

- **Framework**: NestJS (modular, scalable)
- **ORM**: Prisma with PostgreSQL
- **API Layers**: REST + GraphQL (Apollo)
- **Authentication**: JWT, OAuth (Google, Facebook)
- **Architecture**: DDD-inspired folder structure with service + repository layers
- **Validation**: `class-validator`, `joi` (for env vars)

---

## Directory Structure (api/)

```
api/
├── src/
│   ├── auth/              # Login, registration, social auth
│   ├── appointments/      # Booking logic
│   ├── clients/           # Client management
│   ├── payments/          # Stripe/PayPal integration
│   ├── subscriptions/     # Plan & usage limit logic
│   ├── companies/         # Salon/service/working hours
│   ├── users/             # User and staff entities
│   ├── notifications/     # Email/SMS/push via Twilio/SES
│   ├── mail/              # Email templates and sending
│   ├── config/            # Environment configs
│   ├── common/            # Guards, decorators, pipes, filters
│   ├── database/          # Prisma setup
│   └── main.ts            # Application entry point
```

---

## 1. Run the Backend

### Option A – Docker

```powershell
docker-compose -f docker-compose.yaml up -d backend db
```

### Option B – Locally (no Docker)

```powershell
cd api
pnpm install
pnpm run start:dev
```

> The backend will be available at: `http://localhost:4000`

---

## 2. Environment Variables

Create `.env` inside `api/src/`:

```
NODE_ENV=development
PORT=4000

DATABASE_URL=postgresql://postgres:password@localhost:5432/taly
JWT_SECRET=dev_jwt_secret
JWT_EXPIRES_IN=1d
```

Environment configs are validated via `joi` and loaded globally with `@nestjs/config`.

---

## 3. Database with Prisma

### Generate Client

```powershell
pnpm run prisma:generate
```

### Run Migrations

```powershell
pnpm run prisma:migrate
```

### Seed Dev Data

```powershell
pnpm run prisma:seed
```

---

## 4. API Documentation

### Swagger (REST)

Once the backend is running:
```
http://localhost:4000/api/docs
```

Includes:
- Auth, Users, Appointments, Payments, Subscriptions, etc.
- JWT authentication support (`Authorize` button in top-right)

### GraphQL Playground

```
http://localhost:4000/graphql
```

You can:
- Query appointments, users, and reports
- Use authenticated headers (JWT token as `Authorization`)

---

## 5. Authentication & Authorisation

- **JWT** is required for all protected routes.
- Use the `@Roles()` decorator to restrict access (e.g., `ADMIN`, `STAFF`, `USER`).
- OAuth support (Google, Facebook) is implemented via `passport` strategies.

Use these guards:

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
```

---

## 6. Testing

### Run All Tests

```powershell
pnpm run test
```

### Run E2E Tests

```powershell
pnpm run test:e2e
```

### Run with Coverage

```powershell
pnpm run test:cov
```

Tests use:
- `jest` with `ts-jest`
- GraphQL & REST mocking
- CI runs all test suites via GitHub Actions

---

## 7. Code Structure

### Service Layer
- Business logic lives in `*.service.ts`
- Services should not depend on controllers

### Controller Layer
- REST endpoints defined in `*.controller.ts`
- Annotated with `@ApiTags`, `@ApiOperation`, etc.

### Resolver Layer
- GraphQL endpoints are in `*.resolver.ts`
- Use Dto inputs and interface outputs

### DTOs
- Validation via `class-validator`
- Swagger decorators: `@ApiProperty`, `@ApiEnum`, etc.

---

## 8. Common Commands

| Command | Description |
|--------|-------------|
| `pnpm run start:dev` | Watch mode |
| `pnpm run start:prod` | Run compiled build |
| `pnpm run build` | Compile TypeScript |
| `pnpm run prisma:studio` | Open database UI |
| `pnpm run format` | Format code using Prettier |
| `pnpm run lint` | Run ESLint |
| `pnpm run test` | Run Jest unit tests |

---

## 9. Debugging Tips

- Enable `debug: true` in `main.ts` logger
- Use breakpoints in VSCode with `start:debug`
- Use `console.warn()` for quick service inspection

---

## 10. Project Conventions

- Use interfaces in `/interfaces` to type return values
- Return `PaginatedResult<T>` from all `findAll()` queries
- Use the standard error handling:
  - `HttpExceptionFilter`
  - `PrismaExceptionFilter`
- Use `TransformInterceptor` to standardise responses

---

## 11. Backend Deployment (Preview)

Handled via GitHub Actions:
- On merge to `main`, a CI pipeline runs:
  - Install → Lint → Test → Build → Deploy

---

## 12. Troubleshooting

| Issue | Solution |
|-------|----------|
| `Cannot connect to database` | Ensure PostgreSQL is running via Docker |
| `PrismaClient not initialized` | Run `pnpm prisma:generate` |
| `Swagger page is blank` | Check your `NODE_ENV`, must be `development` |
| `JWT expired` | Check your `.env` for correct `JWT_EXPIRES_IN` |
| `CORS issue` | Update `CORS_ORIGINS` in config to include frontend URL |

---

## Questions?

Contact the backend team or open an issue in the GitHub repo.

---
```