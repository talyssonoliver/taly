```md
# Environment & Secrets Management – Taly CRM

This guide outlines how environment variables and secrets are structured, stored, and accessed across Taly CRM’s environments—local, staging, and production. It explains how to configure `.env` files, secure credentials, and handle sensitive data safely during development and deployment.

---

## 1. Why Environment Separation Matters

Using environment variables allows you to:

- Avoid hardcoded secrets (e.g., passwords, API keys)
- Maintain different configurations for dev/staging/prod
- Secure access to third-party services (Stripe, SES, Twilio)
- Enable feature toggles or rate limits per environment

---

## 2. Directory Structure

```plaintext
.env.local                     ← For local dev (NOT committed)
.env.example                   ← Safe template (committed)
api/src/.env                   ← Backend environment
apps/dashboard/.env.local      ← Frontend env for dashboard
apps/booking/.env.local        ← Booking app env
```

> NEVER commit `.env.local` or any file containing secrets.

---

## 3. Environment File Example (`.env.local`)

```env
# API
API_URL=http://localhost:4000

# Auth
JWT_SECRET=dev_secret
JWT_EXPIRES_IN=1d

# PostgreSQL
DATABASE_URL=postgresql://postgres:password@localhost:5432/taly

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx

# AWS SES
AWS_SES_REGION=eu-west-1
AWS_SES_ACCESS_KEY=...
AWS_SES_SECRET_KEY=...

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxx
TWILIO_FROM_NUMBER=+441234567890
```

---

## 4. Loading Strategy by App

### Backend (NestJS)

- Loaded via `@nestjs/config`
- Validated with `joi` schema in `config/configuration.ts`
- File: `api/src/.env`

### Frontend (Next.js)

- Must prefix all exposed vars with `NEXT_PUBLIC_`
- File: `apps/dashboard/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_BOOKING_URL=https://book.taly.dev
```

---

## 5. Production Secrets

### Options:

| Method                  | Description                                 |
|-------------------------|---------------------------------------------|
| AWS SSM Parameter Store | Secure, encrypted values per environment    |
| GitHub Actions Secrets  | Used in CI/CD pipelines                     |
| `.env.production`       | Loaded manually at runtime (discouraged)    |

> Use SSM for runtime config and GitHub Secrets for build-time tokens.

---

## 6. Accessing Secrets in CI/CD

```yaml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
```

Store secrets via GitHub:

- Repository → Settings → Secrets → Actions

---

## 7. Local Dev Tips

- Copy the example:
  ```powershell
  Copy-Item .env.example .env.local
  ```
- Use `.env.development.local` to override team-wide values
- Never commit `.env.local` or logs with secret content

---

## 8. Rotating Secrets

| Action          | Frequency        |
|-----------------|------------------|
| JWT Secret      | Every 90 days    |
| Stripe Webhooks | Every 60 days    |
| Twilio Auth     | Every 90 days    |
| SES Keys        | Annually         |

All rotations must:
- Invalidate old values in CI and SSM
- Regenerate `.env.local` templates
- Notify team via `#taly-infra`

---

## 9. Secrets Validation

Each module includes a validator for required variables:

- Backend: `config/configuration.ts`
- Frontend: checked via `zod` or fallback error messages

If a required secret is missing:
- App fails early with clear error
- CI will throw during build

---

## 10. Related Files

| File | Purpose |
|------|---------|
| `.env.example` | Template for local dev |
| `config/configuration.ts` | Joi validator for backend |
| `.github/workflows/*.yml` | CI/CD secrets usage |
| `apps/dashboard/env.ts` | Frontend ENV abstraction |
| `docs/onboarding/developer-environment.md` | Setup flow |

---

## 11. Questions?

- Slack: `#taly-devops`
- Email: `infra@taly.dev`

---
```
