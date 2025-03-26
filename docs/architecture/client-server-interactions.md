```md
# Client–Server Interactions – Taly CRM

This document describes the architecture, standards, and tooling that govern how the frontend applications (Dashboard, Booking, Payments) interact with the backend services. This includes REST and GraphQL conventions, request/response flows, authentication, error handling, and caching.

---

## 1. Communication Overview

| Client App         | Backend Target     | Protocol | Auth         |
|--------------------|--------------------|----------|--------------|
| Dashboard (Next.js)| API (`/api`)       | REST     | JWT (Bearer) |
| Booking (Next.js)  | API (`/api`)       | REST     | Public/Token |
| Serverless scripts | API (`/graphql`)   | GraphQL  | Service token |
| CI/CD Scripts      | Admin APIs         | REST     | Admin JWT     |

---

## 2. API Entry Points

| Path                    | Type     | Description                             |
|-------------------------|----------|-----------------------------------------|
| `/api/auth`             | REST     | Login, register, OAuth                  |
| `/api/appointments`     | REST     | Booking, availability, status updates   |
| `/api/payments`         | REST     | Payment processing and receipts         |
| `/api/users`            | REST     | Profile updates, plan info              |
| `/graphql`              | GraphQL  | Reports, analytics, batch queries       |
| `/api/docs`             | Swagger  | REST schema (Swagger UI)                |

---

## 3. Request Standards

### 3.1. REST

- JSON body for `POST`, `PATCH`
- Auth via header:
  ```http
  Authorization: Bearer <access_token>
  ```
- Query params for filters, pagination:
  ```
  /appointments?page=1&limit=10&status=CONFIRMED
  ```

### 3.2. GraphQL

- Endpoint: `/graphql`
- POST body:
  ```json
  {
    "query": "query { reports { revenue } }",
    "variables": {}
  }
  ```

- Recommended headers:
  ```http
  Content-Type: application/json
  Authorization: Bearer <token>
  ```

---

## 4. Authentication Flow

### Login Response:

```json
{
  "accessToken": "<JWT>",
  "refreshToken": "<JWT>",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "role": "ADMIN",
    "plan": "PRO"
  }
}
```

- Access token stored in `httpOnly` cookie or memory
- Auto-refreshed via `/auth/refresh` using refresh token
- Token contains user ID, email, role, and plan

---

## 5. Axios Client Standard

Implemented in:

```
apps/dashboard/src/lib/axios.ts
```

### Interceptor Logic:

- Attaches `Authorization` header with Bearer token
- On `401`, auto-attempts refresh and retries once
- Shows toast for `500+` or network errors

### Example:

```ts
const response = await api.get('/appointments?page=1');
```

---

## 6. Zod + Toast Integration

Each API call is:

- Validated with a Zod schema
- Wrapped in a try/catch to trigger toast

### Example:

```ts
try {
  const response = await api.post('/auth/login', data);
  const result = loginResponseSchema.parse(response.data);
} catch (error) {
  toast.error('Login failed. Please try again.');
}
```

Schemas are defined in `apps/dashboard/src/schema/`.

---

## 7. Pagination Standard

### Backend returns:

```json
{
  "data": [/* array */],
  "meta": {
    "total": 120,
    "page": 1,
    "limit": 10
  }
}
```

### Frontend uses:

```ts
const { data, meta } = await api.get('/clients');
setClients(data);
setPagination(meta);
```

---

## 8. Error Handling Standard

### API Errors return:

```json
{
  "statusCode": 403,
  "message": "Access denied",
  "error": "Forbidden"
}
```

### Toast displayed via:

```ts
toast.error(error.response?.data?.message || 'Unexpected error occurred');
```

---

## 9. Caching & State Management

| Type               | Library        | Used In         |
|--------------------|----------------|-----------------|
| Remote Data        | React Query    | App Router pages |
| Global Auth State  | Zustand        | Header, route guards |
| UI state           | Local `useState` or `useReducer` | Forms, modals |

### React Query Caching:

```ts
const { data, isLoading } = useQuery(['clients'], () => api.get('/clients'));
```

---

## 10. Uploads & Media

- Uploads are POSTed to `/api/uploads`
- File is stored in AWS S3 or local `uploads/`
- Response:
  ```json
  {
    "url": "https://cdn.taly.dev/salons/logo.jpg"
  }
  ```

---

## 11. Rate Limiting

- 100 requests/min per IP
- Global throttling via `@nestjs/throttler`
- 429 errors returned as:

```json
{
  "statusCode": 429,
  "message": "Too many requests. Please try again later.",
  "error": "Too Many Requests"
}
```

---

## 12. Client Retry Logic

- Retried once on token expiration
- Backend-side retries are handled manually via `RetryService`
- Use exponential backoff for future polling/refresh flows

---

## 13. Planned Enhancements

| Feature             | Status     |
|---------------------|------------|
| GraphQL Federation  | Planned    |
| API Versioning      | Planned (`/v2/`) |
| WebSocket/Realtime  | Future     |
| Offline mode        | Research   |

---

## 14. Related Files

| File | Purpose |
|------|---------|
| `axios.ts` | Central API client wrapper |
| `auth.store.ts` | Auth state and token logic |
| `toast.ts` | UI feedback handler |
| `zod-schemas/` | Input/output validation |
| `interceptors.ts` | Global request/response logic |

---

## 15. Questions?

- Slack: `#taly-frontend`
- Email: `api@taly.dev`

---
```