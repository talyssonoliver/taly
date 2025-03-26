```md
# GitHub Actions – CI/CD Workflows for Taly CRM

This document explains how GitHub Actions is used to automate testing, builds, and deployments across the Taly CRM monorepo. It includes workflow file structure, secrets management, caching strategies, and environment-specific logic for frontend, backend, and serverless packages.

---

## 1. Overview

| Workflow File                        | Purpose                            |
|-------------------------------------|------------------------------------|
| `.github/workflows/ci.yml`          | Run full test, lint, and build on PRs and pushes |
| `.github/workflows/frontend-ci.yml` | Build and test dashboard + booking |
| `.github/workflows/backend-ci.yml`  | Test backend modules (NestJS)      |
| `.github/workflows/serverless.yml`  | Lint and deploy Lambda functions   |
| `.github/workflows/nightly-build.yml` | Scheduled test suite and deployment dry-run |

All workflows run inside GitHub-hosted runners using Ubuntu + Node.js.

---

## 2. Node & pnpm Setup

Each workflow includes:

```yaml
steps:
  - uses: actions/setup-node@v3
    with:
      node-version: 22
      cache: 'pnpm'

  - uses: pnpm/action-setup@v2
    with:
      version: 8
```

---

## 3. Monorepo Structure Support

Each workflow uses:

```yaml
- name: Install dependencies
  run: pnpm install
```

Thanks to `pnpm-workspace.yaml`, this installs all dependencies across:

- `apps/`
- `api/`
- `shared/`
- `serverless/`

> Caching is automatically managed with `actions/cache`.

---

## 4. Lint, Test & Build Steps

### Common Workflow Block:

```yaml
- name: Lint
  run: pnpm run lint

- name: Test
  run: pnpm run test

- name: Build
  run: pnpm run build
```

Each command respects workspace configurations (e.g. `tsconfig`, `.eslintrc`, Jest).

---

## 5. Deployment Strategy

| Target      | Method         | Trigger             |
|-------------|----------------|---------------------|
| Preview App | Manual or PR   | Vercel, GitHub Pages |
| Production  | Tag Push       | (e.g. `v1.2.0`)     |
| Serverless  | Push to `main` | `serverless.yml`    |

> Cloud environments are configured with secrets and staging/prod deploy logic.

---

## 6. Secrets Management

Secrets are stored in:

```
GitHub → Settings → Secrets → Actions
```

### Required Variables:

| Secret Name              | Used For                   |
|--------------------------|----------------------------|
| `DATABASE_URL`           | Backend + test DB          |
| `STRIPE_SECRET_KEY`      | Payment functions          |
| `JWT_SECRET`             | Backend auth/token logic   |
| `AWS_ACCESS_KEY_ID`      | Serverless deployment      |
| `AWS_SECRET_ACCESS_KEY`  | Serverless deployment      |
| `TWILIO_ACCOUNT_SID`     | Notification testing       |

---

## 7. Example: `ci.yml`

```yaml
name: CI Pipeline

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 22

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Lint
        run: pnpm run lint

      - name: Test
        run: pnpm run test

      - name: Build
        run: pnpm run build
```

---

## 8. Scheduled Workflows

Used in: `nightly-build.yml`

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Every night at 2am UTC
```

Runs:
- Full test suite
- Lint check
- Optional deploy dry-run

---

## 9. Serverless Deploy Workflow

- Triggered on merge to `main`
- Deploys using `serverless deploy`
- Auth via GitHub secrets for AWS keys
- Uses `.env.production` per function

---

## 10. PR Checks

All CI workflows are required on PRs via branch protection rules:

- ✅ Lint
- ✅ Test
- ✅ Build success

If any fail, the PR cannot be merged until fixed.

---

## 11. Notifications (Planned)

Future enhancements:
- Slack alerts on failure
- Discord notifications
- Build badge per app

---

## 12. Related Files

| File                                  | Purpose                        |
|---------------------------------------|--------------------------------|
| `.github/workflows/ci.yml`           | Full pipeline                  |
| `.github/workflows/frontend-ci.yml`  | Next.js + shared-ui build/test |
| `.github/workflows/backend-ci.yml`   | Backend test/build             |
| `.github/workflows/serverless.yml`   | Deploy Lambda functions        |
| `pnpm-workspace.yaml`                | Monorepo dependency linking    |

---

## 13. Questions?

- Slack: `#taly-devops`
- Email: `ci@taly.dev`

---
```
