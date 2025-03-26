```md
# Subscription Plan Limits & Enforcement

This document outlines the logic, configuration, and enforcement of feature and usage limits based on subscription plans in the Taly CRM system. This includes how limits are applied in the backend, how usage is calculated, and what happens when a limit is exceeded.

---

## 1. Plan Overview

Taly offers 3 subscription tiers:

| Plan       | Monthly Appointments | Features                                     | Transaction Fee |
|------------|----------------------|----------------------------------------------|------------------|
| **Free**   | 50                   | Basic appointment management                 | 3%              |
| **Pro**    | 300                  | Custom branding, dashboard, SMS/email        | 0%              |
| **Premium**| Unlimited            | Full analytics, white-label, priority support| 0%              |

> All plans are defined and configured in the database via the `plans` table and managed via `@api/src/subscriptions`.

---

## 2. Limits Structure

### Defined in:

```
@api/src/subscriptions/constants/plan-limits.constants.ts
```

```ts
export const PLAN_LIMITS = {
  FREE: {
    appointmentsPerMonth: 50,
    transactionFeePercentage: 3,
    analytics: false,
    customDomain: false,
  },
  PRO: {
    appointmentsPerMonth: 300,
    transactionFeePercentage: 0,
    analytics: true,
    customDomain: true,
  },
  PREMIUM: {
    appointmentsPerMonth: Infinity,
    transactionFeePercentage: 0,
    analytics: true,
    customDomain: true,
    whiteLabel: true,
  },
};
```

---

## 3. How Limits Are Applied

### 1. **Appointment Limits**

- Enforced on `AppointmentService.create()`
- Validates number of appointments made in the current billing period
- If over quota:
  - Rejects booking with `409 Conflict`
  - Returns custom message (e.g. “You’ve reached the 50 appointments limit”)

### 2. **Transaction Fee Logic**

- Handled in `PaymentService.create()`
- Reads plan tier and applies 3% fee only for Free plan
- Fee is subtracted before Stripe/PayPal payout

### 3. **Feature Gates**

- UI components use plan metadata to enable/disable features:
  - Access to dashboard graphs
  - PDF/Excel exports
  - Custom domain setup
  - Website theme editor

> These are backed by backend-level boolean flags for security.

---

## 4. Plan Retrieval & Usage

### 1. At Login

- `UserService.getPlanDetails(userId)` is called
- Plan details are cached for 15 min (Redis)
- Returned in JWT payload and `/me` profile

### 2. At Booking Time

- Appointment logic queries current usage for salon owner
- Query:
  ```sql
  SELECT COUNT(*) FROM appointments
  WHERE salonId = $salonId AND startTime BETWEEN $start AND $end
  ```

---

## 5. Plan Upgrade / Downgrade

- Plans are managed through `Stripe Checkout`
- Subscription changes update:
  - Current `planId` on user/company
  - Usage counters reset at billing cycle start
  - Downgrades are delayed until end of cycle

Stripe webhooks (`subscription.updated`) are processed via:
```
@api/src/subscriptions/stripe-webhook.service.ts
```

---

## 6. UI Integration

### Dashboard Plan Enforcement

```tsx
if (currentPlan === 'FREE' && monthlyUsage >= 50) {
  return <UpgradeBanner />;
}
```

### API Guard (Optional)

In some modules, we apply:

```ts
if (plan.name === 'FREE' && usage >= PLAN_LIMITS.FREE.appointmentsPerMonth) {
  throw new ConflictException('Monthly booking limit reached.');
}
```

---

## 7. Testing Plan Limits

### Unit Tests

- Mock a Free plan
- Create 50 appointments
- Assert that 51st fails with `409`

### E2E Tests

- Create a full user flow:
  - Sign up → Book until quota → Upgrade → Retry booking → Success

---

## 8. Future Considerations

- Rate limiting by plan tier (requests per minute)
- Feature flag integration (for A/B testing paid features)
- Granular permission tokens (e.g. API usage limits)

---

## 9. Related Files

| File | Purpose |
|------|---------|
| `subscriptions.service.ts` | Core plan logic and switching |
| `appointments.service.ts` | Applies booking quota validation |
| `payment.service.ts` | Applies transaction fees |
| `plan-limits.constants.ts` | Centralised limits by plan |
| `StripeWebhookService` | Listens to plan/subscription events |
| `@shared/plan.types.ts` | Shared types used in UI for rendering |

---

## 10. Contact

For questions about plan configuration or monetisation strategy, contact:

- **Product Team**: `@product-team`
- **Email**: billing@taly.dev

---
```