```md
# Appointments API Documentation

This document covers the REST and GraphQL APIs for managing appointments in the Taly CRM system. It includes endpoint definitions, input/output schemas, and usage examples for creating, updating, rescheduling, cancelling, and querying appointments.

---

## Overview

- API Base URL: `http://localhost:4000/api/appointments`
- GraphQL Endpoint: `http://localhost:4000/graphql`
- Auth Required: Yes (JWT)
- Rate-Limited: Yes (100 req/min default)
- Access Control: RBAC enforced (see `@Roles()`)

---

## REST Endpoints

### `GET /appointments`

Retrieve a paginated list of appointments.

#### Query Params:
- `page` (optional): number (default: 1)
- `limit` (optional): number (default: 10)
- `status`: `"SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | "RESCHEDULED"`
- `startDate`, `endDate`: ISO strings
- `salonId`: optional filter

#### RBAC:
- `ADMIN`, `STAFF`

---

### `GET /appointments/me`

Retrieve current user’s appointments.

#### Query Params:
- `page`, `limit`
- `status`
- `upcoming`: `true` to filter future appointments

#### RBAC:
- `USER`, `ADMIN`, `STAFF`

---

### `GET /appointments/:id`

Retrieve a specific appointment by ID.

#### RBAC:
- `ADMIN`, `STAFF`, or appointment owner (`USER`)

---

### `GET /appointments/salon/:salonId`

Fetch appointments by salon, optionally filtered by date or status.

---

### `GET /appointments/salon/:salonId/available-slots`

Returns time slots available for a salon on a specific date and service.

#### Required Query Params:
- `date`: ISO date (e.g. `2024-06-21`)
- `serviceId`: service UUID
- `staffId` (optional)

---

### `POST /appointments`

Create a new appointment.

#### Request Body:

```json
{
  "salonId": "uuid",
  "serviceId": "uuid",
  "startTime": "2024-06-21T14:00:00Z",
  "staffId": "uuid (optional)",
  "notes": "Optional notes"
}
```

#### Returns:
Created appointment details with calculated `endTime`, `price`, etc.

---

### `PATCH /appointments/:id`

Update appointment notes or change service/staff.

#### Fields:
- `serviceId` (optional)
- `staffId` (optional)
- `status` (optional)
- `notes` (optional)

---

### `PATCH /appointments/:id/reschedule`

Reschedule an existing appointment.

#### Body:
```json
{
  "startTime": "2024-06-22T15:00:00Z",
  "staffId": "uuid (optional)"
}
```

---

### `PATCH /appointments/:id/cancel`

Cancel an appointment and optionally provide a reason.

```json
{
  "reason": "Client unavailable"
}
```

---

### `PATCH /appointments/:id/confirm`

Mark an appointment as confirmed (staff only).

---

### `PATCH /appointments/:id/complete`

Mark an appointment as completed.

---

### `PATCH /appointments/:id/no-show`

Mark an appointment as no-show.

---

### `DELETE /appointments/:id`

Delete an appointment permanently.

#### RBAC:
- `ADMIN` only

---

## GraphQL Operations

### Query: `appointments`

```graphql
query {
  appointments(page: 1, limit: 10, status: CONFIRMED) {
    data {
      id
      startTime
      endTime
      status
      user {
        fullName
      }
    }
    meta {
      total
      page
    }
  }
}
```

---

### Mutation: `createAppointment`

```graphql
mutation {
  createAppointment(input: {
    salonId: "uuid"
    serviceId: "uuid"
    startTime: "2024-06-21T14:00:00Z"
    staffId: "uuid"
    notes: "Be gentle"
  }) {
    id
    status
    formattedStartTime
    user {
      email
    }
  }
}
```

---

### Mutation: `rescheduleAppointment`

```graphql
mutation {
  rescheduleAppointment(id: "uuid", input: {
    startTime: "2024-06-22T15:00:00Z"
    staffId: "uuid"
  }) {
    status
    startTime
  }
}
```

---

## DTO & Response Schemas

- `CreateAppointmentDto`: `salonId`, `serviceId`, `startTime`, `staffId?`, `notes?`
- `UpdateAppointmentDto`: `serviceId?`, `staffId?`, `status?`, `notes?`
- `RescheduleAppointmentDto`: `startTime`, `staffId?`
- `CancelAppointmentDto`: `reason?`

Each response contains:
- `startTime`, `endTime`
- `formattedStartTime`, `formattedDuration`
- `price`, `status`
- `salon`, `staff`, `user`, `service` objects

---

## Status Enum

```ts
export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED',
  PENDING = 'PENDING',
}
```

---

## Validation & Errors

- All inputs validated via `class-validator`
- Errors returned with:
  - `400 Bad Request`: Invalid input
  - `403 Forbidden`: Unauthorized role
  - `404 Not Found`: Appointment doesn’t exist
  - `409 Conflict`: Time slot not available

---

## Audit & Logging

All mutations are logged via:
- `Logger(AppointmentsController)`
- Future: persisted audit logs per company

---

## Rate Limiting

- Global limit: `100 requests/min` per IP (via `@nestjs/throttler`)
- Can be tuned via `ThrottlerModule` in `AppModule`

---

## Planned Enhancements

- Auto-cancel expired appointments
- Calendar ICS export
- Real-time status sync via WebSocket or polling

---

## Related Files

| File | Purpose |
|------|---------|
| `appointments.controller.ts` | REST endpoints |
| `appointments.resolver.ts` | GraphQL operations |
| `appointments.service.ts` | Core logic |
| `appointment.repository.ts` | DB access via Prisma |
| `appointment.constants.ts` | Configuration (slot size, fees, timeouts) |
| `appointment-status.enum.ts` | Enum used in UI & backend |
| `dto/` | Input validation |
| `entities/` | GraphQL object types |

---

## Questions?

Reach out via:
- Slack: `#taly-backend`
- GitHub: [Open an Issue](https://github.com/taly-crm/issues)
- Email: `api@taly.dev`

---
```