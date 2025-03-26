```md
# User API Documentation

This document details all endpoints related to user authentication, profile management, role assignment, and subscription linkage within the Taly CRM backend. It includes both REST and GraphQL access patterns.

---

## 1. Overview

| Path              | Method | Auth Required | Description                          |
|-------------------|--------|----------------|--------------------------------------|
| `/auth/register`  | POST   | No             | Register a new user account          |
| `/auth/login`     | POST   | No             | Authenticate user and receive JWTs   |
| `/auth/refresh`   | POST   | Yes (refresh)  | Refresh the access token             |
| `/users/me`       | GET    | Yes            | Retrieve current user profile        |
| `/users/:id`      | PATCH  | Yes (Admin)    | Update user data or roles            |
| `/users/me`       | PATCH  | Yes            | Update own profile (email, name)     |
| `/users/me/password` | PATCH | Yes          | Change current password              |

---

## 2. Authentication Endpoints

### `POST /auth/register`

Registers a new user.

#### Payload:
```json
{
  "email": "john@example.com",
  "password": "Test123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Response:
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { "id": "uuid", "email": "john@example.com", "role": "USER" }
}
```

---

### `POST /auth/login`

Authenticates an existing user.

#### Payload:
```json
{
  "email": "john@example.com",
  "password": "Test123!"
}
```

#### Response: (same as register)

---

### `POST /auth/refresh`

Uses a refresh token to get a new access token.

#### Payload:
```json
{
  "refreshToken": "..."
}
```

#### Response:
```json
{
  "accessToken": "newAccessToken"
}
```

---

## 3. Profile Endpoints

### `GET /users/me`

Returns current user details.

#### Response:
```json
{
  "id": "uuid",
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "USER",
  "plan": "FREE"
}
```

---

### `PATCH /users/me`

Update user details (not password or plan).

#### Payload:
```json
{
  "firstName": "Johnny",
  "lastName": "Smith"
}
```

---

### `PATCH /users/me/password`

Change password.

#### Payload:
```json
{
  "currentPassword": "Test123!",
  "newPassword": "NewPass456!"
}
```

---

## 4. Admin User Management

### `PATCH /users/:id`

Update another user's profile or role (Admin only).

#### Payload:
```json
{
  "role": "ADMIN",
  "plan": "PRO"
}
```

---

## 5. GraphQL User Queries

### `query me`

```graphql
query {
  me {
    id
    email
    fullName
    role
    plan
  }
}
```

---

## 6. Roles & Permissions

| Role  | Can update own profile | Can assign roles | Can upgrade plans |
|-------|------------------------|------------------|-------------------|
| USER  | ✅                     | ❌               | ✅                |
| STAFF | ✅                     | ❌               | ❌                |
| ADMIN | ✅                     | ✅               | ✅                |

Roles are validated via `@RolesGuard` and set during auth login or via admin panel.

---

## 7. JWT Payload Structure

```json
{
  "sub": "user_id",
  "email": "john@example.com",
  "role": "USER",
  "plan": "FREE",
  "iat": 1711122334,
  "exp": 1711125934
}
```

- `sub` = user ID
- `plan` = FREE, PRO, PREMIUM (used in feature gating)

---

## 8. Errors & Status Codes

| Code | Meaning                         |
|------|----------------------------------|
| 400  | Invalid input                   |
| 401  | Unauthorized (invalid token)    |
| 403  | Forbidden (RBAC violation)      |
| 409  | Email already in use            |

---

## 9. Related Files

| File                            | Purpose                          |
|---------------------------------|----------------------------------|
| `auth.controller.ts`           | Login, register, refresh         |
| `users.controller.ts`          | Profile CRUD                     |
| `auth.service.ts`              | Token creation/validation        |
| `jwt.strategy.ts`              | Access token guard               |
| `roles.guard.ts`               | Enforce RBAC                     |
| `user.entity.ts`               | GraphQL object                   |

---

## 10. Planned Enhancements

| Feature                | Status  |
|------------------------|---------|
| Email verification     | Planned |
| Forgotten password flow| Planned |
| OAuth with Facebook    | Planned |
| MFA (2FA)              | Future  |

---

## 11. Questions?

- Slack: `#taly-backend`
- Email: `auth@taly.dev`

---
```