```md
# Admin API Documentation – Taly CRM (Internal)

This document outlines the internal **Admin API endpoints** used by Taly staff to manage platform-wide data, monitor tenant behaviour, and execute system-level operations. These routes are restricted to users with `SUPER_ADMIN` or `INTERNAL_SERVICE` roles.

> **Important**: These endpoints must never be exposed to client companies or salon users. Access is controlled via special API tokens and environment-based RBAC.

---

## 1. Overview

| Endpoint                          | Method | Auth Required    | Purpose                          |
|-----------------------------------|--------|------------------|----------------------------------|
| `/admin/users`                   | GET    | SUPER_ADMIN      | List all users                   |
| `/admin/users/:id/impersonate`  | POST   | SUPER_ADMIN      | Generate token to impersonate user |
| `/admin/companies`              | GET    | SUPER_ADMIN      | List all companies               |
| `/admin/companies/:id/suspend` | PATCH  | SUPER_ADMIN      | Suspend a company + all logins   |
| `/admin/plans/stats`            | GET    | SUPER_ADMIN      | Plan usage analytics             |
| `/admin/tenants/usage`          | GET    | SUPER_ADMIN      | View monthly usage by tenant     |
| `/admin/logs`                   | GET    | INTERNAL_SERVICE | Access system logs or audit trail |
| `/admin/ping`                   | GET    | SUPER_ADMIN      | Liveness + database health check |

---

## 2. Authentication

- Requires internal API token (`Authorization: Bearer <internal-admin-token>`)
- Role must be one of:
  - `SUPER_ADMIN`: full admin console access
  - `INTERNAL_SERVICE`: limited access for telemetry/reporting

> Tokens are managed in AWS SSM and rotated manually.

---

## 3. Key Endpoints

### `GET /admin/users`

Returns paginated user list across all tenants.

#### Query Params:
- `page`, `limit`
- `role`, `email`, `plan`

---

### `POST /admin/users/:id/impersonate`

Generates a **temporary signed JWT** that lets an admin act as the selected user.

#### Response:
```json
{
  "token": "eyJhbGciOi...",
  "expiresIn": "15m"
}
```

Used to troubleshoot issues reported by customers.

---

### `PATCH /admin/companies/:id/suspend`

Suspends a company and its associated users.

#### Request:
```json
{
  "reason": "Policy violation",
  "suspendBookings": true
}
```

Marks the company as `status = 'SUSPENDED'` and denies login/bookings.

---

### `GET /admin/plans/stats`

Returns a breakdown of Free, Pro, and Premium accounts.

#### Response:
```json
{
  "free": 128,
  "pro": 42,
  "premium": 10,
  "revenueEstimate": 10400
}
```

---

### `GET /admin/tenants/usage`

Returns per-company usage metrics.

#### Response:
```json
[
  {
    "companyId": "uuid",
    "name": "Glow Hair",
    "appointments": 212,
    "revenue": 7200,
    "plan": "PRO"
  }
]
```

---

## 4. Logs API (INTERNAL_SERVICE)

### `GET /admin/logs`

Returns platform-generated system events.

#### Filters:
- `resourceType` (e.g., `appointment`, `email`)
- `actorId`
- `dateRange`

Used for debugging, security reviews, or compliance reports.

---

## 5. Health Check

### `GET /admin/ping`

Returns API + DB health for uptime monitors.

#### Response:
```json
{
  "status": "ok",
  "timestamp": "2024-04-01T12:00:00Z",
  "uptime": "31 days",
  "db": "healthy"
}
```

---

## 6. Security & Access Control

| Mechanism                   | Description                          |
|-----------------------------|--------------------------------------|
| RBAC via `RolesGuard`       | Requires `SUPER_ADMIN` or above      |
| Token headers               | Tokens are environment-scoped        |
| Rate limiting               | Enabled globally for all admin APIs  |
| Audit logging               | All admin requests are logged        |

---

## 7. Planned Enhancements

| Feature                      | Status     |
|------------------------------|------------|
| Admin web interface          | Planned    |
| Audit dashboard              | In design  |
| Configurable platform limits | Planned    |
| Soft delete + restore users  | Future     |

---

## 8. Related Files

| File                          | Purpose                            |
|-------------------------------|------------------------------------|
| `admin.controller.ts`         | Routes for admin endpoints         |
| `admin.service.ts`            | Business logic for impersonation, suspend, etc. |
| `auth/internal.guard.ts`      | Validates internal-only tokens     |
| `@shared/enums/role.enum.ts`  | Defines `SUPER_ADMIN` role         |
| `audit-log.service.ts`        | Logs all admin-level activity      |

---

## 9. Questions?

- Slack: `#taly-platform-admins`
- Email: `admin@taly.dev`

---
```