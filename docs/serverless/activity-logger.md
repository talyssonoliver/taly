```md
# Serverless Function: activity-logger

This document describes the `activity-logger` serverless function used in the Taly CRM platform to persist, audit, and analyse user and system actions across services. It provides a non-blocking, asynchronous logging layer for auditing security-sensitive events and usage metrics.

---

## 1. Purpose

The `activity-logger` function enables:

- Capturing user and admin activity (e.g. logins, bookings, cancellations)
- Logging API events for analytics or forensic auditing
- Generating immutable logs without impacting primary services
- Future integration with reporting dashboards or compliance systems

---

## 2. Runtime & Platform

| Platform     | Runtime     | Deployment Tool         |
|--------------|-------------|--------------------------|
| AWS Lambda   | Node.js 18  | Serverless Framework     |
| Trigger      | HTTP (POST) | Optional: SNS/SQS events |

---

## 3. Endpoint

```http
POST /log-activity
```

### Headers:
- `Authorization: Bearer <internal-api-token>`

### Payload:

```json
{
  "actorId": "user-uuid",
  "action": "appointment_cancelled",
  "resource": "appointment",
  "resourceId": "appointment-uuid",
  "timestamp": "2024-03-28T12:45:30Z",
  "metadata": {
    "reason": "Client no-show",
    "role": "STAFF"
  }
}
```

---

## 4. Use Cases

| Action                      | Description                        |
|-----------------------------|------------------------------------|
| `user_login`                | User logged in to dashboard        |
| `appointment_created`       | Appointment booked or rescheduled  |
| `payment_processed`         | Payment success or refund issued   |
| `subscription_upgraded`     | Plan change via Stripe             |
| `profile_updated`           | Email, password, or name changed   |
| `domain_configured`         | Custom domain setup                |

---

## 5. Database Schema

The function persists logs to a database table (e.g. DynamoDB, RDS, or S3):

```ts
interface ActivityLog {
  id: string;
  actorId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  userAgent?: string;
  ipAddress?: string;
}
```

> Can also be stored in S3 as append-only logs per tenant.

---

## 6. Data Enrichment (Optional)

Enrichments include:

- Geo-IP (based on request IP)
- User agent parsing
- Role verification
- Tenant/company ID linkage

---

## 7. Local Development

```bash
cd serverless/activity-logger
pnpm install
pnpm run build

sls invoke local -f logActivity --data '{"actorId":"user-uuid", ...}'
```

---

## 8. Deployment

```bash
sls deploy --stage production
```

Lambda function is configured in `serverless.yml` with IAM write permissions to database or S3.

---

## 9. Privacy & Compliance

- All logs are timestamped and immutable
- PII can be scrubbed or anonymised (e.g., `email_hash`)
- Logs are retained for 180 days (configurable)
- GDPR/UK compliance requires log consent (planned via config flag)

---

## 10. Planned Enhancements

| Feature                   | Status   |
|---------------------------|----------|
| Real-time dashboard feed  | Planned  |
| Multi-tenant log partitioning | Planned |
| Integration with Grafana  | Future   |
| Alert triggers (e.g. failed logins) | Future |
| Custom log levels (info/warn/critical) | Planned |

---

## 11. Related Files

| File                        | Purpose                          |
|-----------------------------|----------------------------------|
| `handler.ts`                | Lambda entry and routing         |
| `log.service.ts`            | Main DB/S3 writer                |
| `validate-input.ts`         | Zod schema for action logging    |
| `serverless.yml`            | Function deployment config       |
| `shared/enums/action-type.ts` | Standardised actions across app |

---

## 12. Questions?

- Slack: `#taly-serverless`
- Email: `security@taly.dev`

---
```