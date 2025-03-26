```md
# Role-Based Access Control (RBAC)

Taly CRM uses **Role-Based Access Control** (RBAC) to manage permissions and secure access to routes and resources across the system (both API and frontend). This document outlines the role hierarchy, responsibilities, implementation details, and best practices.

---

## 1. Overview

RBAC allows us to define **who** can do **what** based on their assigned **role**. This improves maintainability, security, and scalability of permission logic across modules.

---

## 2. Defined Roles

| Role        | Description |
|-------------|-------------|
| `ADMIN`     | Full access to all companies, users, and system-wide features |
| `STAFF`     | Access limited to their salon context (manage bookings, clients, services) |
| `USER`      | End-users or salon owners with permission only for their own business data |
| `ANONYMOUS` | Unauthenticated users (used mainly for booking public interface) |

> Roles are defined in `@api/src/common/enums/roles.enum.ts`

---

## 3. Role Capabilities Matrix

| Feature / Module       | ADMIN | STAFF | USER | ANONYMOUS |
|------------------------|:-----:|:-----:|:----:|:---------:|
| View own profile       |  ✔    |  ✔    | ✔    | ✖         |
| Manage staff           |  ✔    |  ✔    | ✖    | ✖         |
| Manage appointments    |  ✔    |  ✔    | ✔    | ✖         |
| Book appointment       |  ✔    |  ✔    | ✔    | ✔         |
| Cancel/reschedule appt |  ✔    |  ✔    | ✔    | ✖         |
| Manage subscriptions   |  ✔    |  ✖    | ✔    | ✖         |
| Access admin dashboard |  ✔    |  ✔    | ✖    | ✖         |
| Create custom domain   |  ✔    |  ✖    | ✔    | ✖         |
| Export analytics       |  ✔    |  ✔    | ✖    | ✖         |
| Send reminders         |  ✔    |  ✔    | ✖    | ✖         |

---

## 4. Backend RBAC Implementation

### Guards

RBAC is enforced using two layered guards:

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.STAFF)
```

- **JwtAuthGuard**: Validates JWT and attaches `user` object to request
- **RolesGuard**: Checks if `user.role` matches allowed roles in `@Roles(...)` decorator

### Decorator

```ts
@Roles(Role.ADMIN)
```

Defined in:
- `@api/src/common/decorators/roles.decorator.ts`
- Consumed by `RolesGuard` (implements `CanActivate`)

### Global Guard Setup

Applied globally in `AppModule`:

```ts
{
  provide: APP_GUARD,
  useClass: RolesGuard,
}
```

This ensures RBAC is enforced across all controllers unless explicitly bypassed.

---

## 5. Frontend RBAC Enforcement

### Role Detection

The user's role is decoded from the JWT and stored in Zustand via the `AuthStore`.

```ts
const { role } = useAuthStore.getState();
```

### Route Protection

Each page uses middleware or wrapper components:

```tsx
<Protected roles={['ADMIN', 'STAFF']}>
  <DashboardPage />
</Protected>
```

Or with `next.config.ts` middleware (optional):

```ts
export function middleware(req) {
  const token = getToken(req);
  const role = token?.role;

  if (role !== 'ADMIN') {
    return NextResponse.redirect('/login');
  }
}
```

### UI Element Hiding

```tsx
{role === 'ADMIN' && <Button>Edit Company Settings</Button>}
```

This hides sensitive features at the UI level, but **must** be paired with API protection.

---

## 6. Example Usage (API)

```ts
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.STAFF)
@Get('appointments')
findAllForSalon(@CurrentUser() user) {
  return this.appointmentsService.findBySalon(user.salonId);
}
```

---

## 7. Testing RBAC

### Unit Tests

- Ensure controllers are tested with users of each role
- Use mocks with `user.role = 'STAFF'` and assert access behavior

### E2E Tests

- Test role-restricted routes (`/users`, `/subscriptions`, `/reports`)
- Validate forbidden access returns `403 Forbidden`

---

## 8. Best Practices

- Avoid using `role === ...` checks inside services. Use decorators + guards.
- Always restrict API endpoints. UI-based restrictions alone are insecure.
- Use feature flags for premium-tier capabilities, in addition to roles.
- Include role in all logs, alerts, and audit records (for observability).
- Store roles in database to allow dynamic permission escalation (future-proofing).

---

## 9. Future Considerations

- Fine-grained **permission-based ACL** system
- Role editor (for super admins)
- Integration with Stripe plans for automatic role upgrades
- Multi-role support (e.g., `user.roles: ['STAFF', 'ADMIN']`)

---

## Related Files

| File Path | Purpose |
|-----------|---------|
| `common/enums/roles.enum.ts` | Defines available roles |
| `common/guards/roles.guard.ts` | Guards requests based on role |
| `common/decorators/roles.decorator.ts` | `@Roles()` usage in controllers/resolvers |
| `auth/auth.service.ts` | Assigns role on login/register |
| `users/users.module.ts` | Manages role updates and creation |

---

## Questions?

If you're unsure whether a route or feature should be role-protected, reach out to:

- **Security Lead**: `@backend-team`
- **Slack**: `#taly-backend`
- **Email**: `security@taly.dev`

---
```