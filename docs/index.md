# Taly CRM Documentation Index

Welcome to the official documentation for the Taly CRM platform. This documentation covers everything from onboarding and architecture to API usage, testing, deployment, and operational practices.

---

## 1. Onboarding

| File | Description |
|------|-------------|
| [`onboarding/developer-environment.md`](./onboarding/developer-environment.md) | Setup guide for local dev (Node, Docker, pnpm) |
| [`onboarding/backend-service-guide.md`](./onboarding/backend-service-guide.md) | Run and debug the NestJS backend API |
| [`onboarding/frontend-setup.md`](./onboarding/frontend-setup.md) | How to work with the Next.js frontend apps |
| [`onboarding/environment-secrets.md`](./onboarding/environment-secrets.md) | (Planned) Managing `.env` and secret values |

---

## 2. Architecture

| File | Description |
|------|-------------|
| [`architecture/rbac.md`](./architecture/rbac.md) | Role-Based Access Control model used across the stack |
| [`architecture/shared-libraries.md`](./architecture/shared-libraries.md) | Structure and conventions for shared UI, types, utils |
| [`architecture/code-style.md`](./architecture/code-style.md) | TypeScript, folder naming, ESLint, Zod, Toast patterns |
| [`architecture/client-server-interactions.md`](./architecture/client-server-interactions.md) | REST/GraphQL API design, interceptors, pagination, errors |

---

## 3. API Documentation

| File | Description |
|------|-------------|
| [`api-docs/appointment-api.md`](./api-docs/appointment-api.md) | Endpoints for managing bookings, slots, status |
| [`api-docs/notification-api.md`](./api-docs/notification-api.md) | Email/SMS logic via SES and Twilio |
| [`api-docs/plan-limits.md`](./api-docs/plan-limits.md) | Free/Pro/Premium tier logic and usage enforcement |
| [`api-docs/user-api.md`](./api-docs/user-api.md) | (Planned) Auth, profile, and OAuth details |
| [`api-docs/reporting-api.md`](./api-docs/reporting-api.md) | (Planned) Revenue and analytics endpoints |

---

## 4. Testing

| File | Description |
|------|-------------|
| [`testing/unit-tests.md`](./testing/unit-tests.md) | Pure function and component test patterns |
| [`testing/integration-tests.md`](./testing/integration-tests.md) | Service, repository, and DB-backed flows |
| [`testing/e2e-tests.md`](./testing/e2e-tests.md) | Full-stack HTTP flows for booking, auth, payments |
| `testing/coverage.md` | (Planned) Coverage rules, reports, thresholds |

---

## 5. Deployment & Infrastructure

| File | Description |
|------|-------------|
| [`deployment/docker-infrastructure.md`](./deployment/docker-infrastructure.md) | Local Docker Compose setup and service explanation |
| `deployment/kubernetes.md` | (Planned) Kubernetes manifests, scaling strategy |
| `deployment/github-actions.md` | (Planned) CI/CD flows using GitHub Actions |
| `deployment/secrets.md` | (Planned) Managing secrets across environments |

---

## 6. Serverless (Planned)

| File | Description |
|------|-------------|
| `serverless/send-email.md` | Automated communication pipeline |
| `serverless/generate-reports.md` | PDF, CSV, and dashboard exports |
| `serverless/activity-logger.md` | Audit logs and event tracking |

---

## 7. DevOps & Monitoring (Planned)

| File | Description |
|------|-------------|
| `monitoring/logs.md` | Logging practices and alert hooks |
| `monitoring/uptime.md` | Status checks, heartbeats, and monitoring |
| `monitoring/webhooks.md` | Stripe/Twilio/Firebase webhook security |

---

## 8. Miscellaneous

| File | Description |
|------|-------------|
| `contributing/code-review-checklist.md` | (Planned) Pull request and QA checklist |
| `branding/style-guide.md` | (Planned) Logo usage, colours, typography |
| `marketing/launch-plan.md` | (Planned) Timeline, assets, and public beta |

---

## Contribution Guidelines

- Update or create `.md` files inside the `docs/` folder
- Use `kebab-case` for filenames
- Link to new docs here for discoverability
- Use relative paths and markdown tables/lists where appropriate

---

## Questions?

- Internal Support: `#taly-dev`
- Email: `engineering@taly.dev`

---
