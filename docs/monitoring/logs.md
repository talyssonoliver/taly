```md
# Logging Strategy – Taly CRM

This document defines the logging strategy for Taly CRM across backend services, frontend apps, serverless functions, and infrastructure. It includes logging formats, destinations, retention policies, and observability best practices for debugging and auditability.

---

## 1. Goals

- Centralise logs across all services and environments
- Make logs searchable, structured, and timestamped
- Support security auditing and failure analysis
- Enable log-based alerts for critical systems

---

## 2. Logging Formats

All logs should follow **structured JSON format**:

```json
{
  "timestamp": "2024-04-01T14:00:00Z",
  "level": "info",
  "service": "api",
  "module": "auth",
  "message": "User logged in",
  "userId": "uuid",
  "ip": "1.2.3.4"
}
```

Logged levels:
- `debug`
- `info`
- `warn`
- `error`
- `fatal` (optional)

---

## 3. NestJS Backend Logging

- Uses a centralised `LoggerService` wrapper
- Outputs logs to `stdout` for container-based pickup
- Also supports writing to file in `logs/api/*.log` during dev

### Example:
```ts
this.logger.log('User registered', {
  userId,
  email
});
```

---

## 4. Frontend Logging

- Browser logs captured using `console.*`
- (Planned) Integration with Sentry for:
  - JS errors
  - Uncaught exceptions
  - Network failures
- User context injected when available (userId, companyId)

---

## 5. Serverless Logging

All Lambda functions (e.g. `send-email`, `generate-reports`) log to:

- **AWS CloudWatch Logs**
- Each log stream is function-scoped
- Retention: 30 days (dev), 90 days (prod)

Use:
```ts
console.log(JSON.stringify({ event, status: 'sent' }));
```

---

## 6. Log Destinations (Planned)

| Environment   | Sink                          |
|---------------|-------------------------------|
| Development   | Local file system (`logs/`)   |
| Staging       | AWS CloudWatch                |
| Production    | CloudWatch or Loki via Fluent Bit |
| CI            | GitHub Actions log artifacts  |

---

## 7. Log Rotation & Retention

| System        | Retention        |
|---------------|------------------|
| CloudWatch    | 30–90 days       |
| Local logs    | Rotated daily via Winston |
| Audit logs    | Archived up to 12 months (planned) |

---

## 8. Correlation & Trace IDs (Planned)

| Context          | Strategy            |
|------------------|---------------------|
| User sessions    | Attach `userId` to all logs |
| Requests         | Generate `traceId` per request (UUID) |
| Frontend errors  | Include `route`, `component`, `timestamp` |

---

## 9. Log File Locations (Local Dev)

| File                          | Purpose                          |
|-------------------------------|----------------------------------|
| `logs/api/errors.log`         | NestJS backend error logs        |
| `logs/serverless/send-email.log` | Email delivery events        |
| `logs/webhooks/errors-*.log` | Failed webhook events            |
| `logs/activity.log`           | Audit entries                    |

---

## 10. Alerts from Logs (Planned)

- Alert on `error` or `fatal` spike
- Monitor login failures or auth anomalies
- Detect webhook or email retry overflow
- Alert on 5xx in production environments

---

## 11. Related Files

| File                          | Purpose                           |
|-------------------------------|-----------------------------------|
| `logger.service.ts`           | NestJS custom logger implementation |
| `fluent-bit.conf`             | (Planned) Log forwarder config     |
| `cloudwatch-logs.tf`          | (Planned) Infra-as-code for log groups |
| `frontend/utils/logger.ts`    | Browser log abstraction            |

---

## 12. Questions?

- Slack: `#taly-logging`
- Email: `infra@taly.dev`

---
```