```md
# Serverless Function: send-email

This document outlines the purpose, structure, and execution of the `send-email` serverless function within the Taly CRM platform. This function is responsible for sending templated transactional emails for booking confirmations, reminders, cancellations, payment receipts, and more.

---

## 1. Purpose

The `send-email` function enables asynchronous, scalable, and cost-efficient email delivery independent of the backend runtime. It supports:

- Booking confirmations
- Appointment reminders
- Payment receipts
- Subscription plan changes
- Report notifications (PDF export, CSV download)

---

## 2. Runtime & Deployment

| Platform     | Runtime   | Deployment Tool |
|--------------|-----------|------------------|
| AWS Lambda   | Node.js 18 | Serverless Framework (`serverless.yml`) |
| Environment  | `staging`, `production` | Per-stage config via `.env` or SSM |

---

## 3. Trigger Types

| Trigger         | Type          | Description                                  |
|------------------|---------------|----------------------------------------------|
| HTTP Endpoint    | POST `/send-email` | Used by API backend to trigger email |
| Queue (Planned)  | SQS or EventBridge | For background processing at scale         |

---

## 4. Endpoint

```http
POST /send-email
```

### Headers:
- `Authorization: Bearer <internal-api-token>`

### Payload:

```json
{
  "to": "client@example.com",
  "template": "booking-confirmation",
  "subject": "Booking Confirmed – Glow Hair Studio",
  "context": {
    "fullName": "Alice Smith",
    "startTime": "2024-03-28T14:00:00Z",
    "service": "Haircut"
  }
}
```

---

## 5. Templates

Emails are rendered using **Handlebars** templates.

| Template Name         | Purpose                          |
|------------------------|----------------------------------|
| `booking-confirmation`| Confirms scheduled appointment    |
| `appointment-reminder`| 24h or same-day reminder          |
| `payment-receipt`     | Sends receipt after Stripe payment|
| `plan-upgrade`        | Notifies user of plan change      |

Templates are located in:

```
serverless/send-email/templates/*.hbs
```

---

## 6. Environment Variables

Loaded via `.env` or cloud secret manager (e.g., AWS SSM).

```env
AWS_SES_REGION=eu-west-1
AWS_SES_ACCESS_KEY_ID=...
AWS_SES_SECRET_ACCESS_KEY=...
DEFAULT_FROM_EMAIL=hello@taly.dev
```

---

## 7. Security

- Function protected by internal API token header
- Token is stored in SSM and validated using middleware
- No public exposure via API Gateway

---

## 8. Error Handling & Retry

- If SES delivery fails:
  - Logs error with timestamp
  - Marks status in logs or DB (if available)
  - Triggers retry queue (Planned: SQS/Dead Letter Queue)
- All failures logged to:
  ```
  /logs/send-email-errors-YYYY-MM-DD.log
  ```

---

## 9. Deployment

Using the Serverless Framework:

```bash
cd serverless/send-email
pnpm install
pnpm run build
sls deploy --stage production
```

Deployment config: `serverless/send-email/serverless.yml`

---

## 10. Development & Testing

Use local invocation with test payload:

```bash
sls invoke local -f sendEmail --data '{"to":"test@example.com","template":"booking-confirmation", ...}'
```

> Requires `aws-sdk`, `@handlebars`, and mocked `.env`.

---

## 11. Related Files

| File                              | Purpose                          |
|-----------------------------------|----------------------------------|
| `handler.ts`                      | Lambda entry point               |
| `templates/*.hbs`                 | Handlebars HTML templates        |
| `email.service.ts`               | Wrapper for SES transport        |
| `validate-payload.ts`            | Zod-based request validation     |
| `serverless.yml`                 | Function config and permissions  |

---

## 12. Planned Enhancements

| Feature                     | Status    |
|-----------------------------|-----------|
| Queue-based fallback        | Planned   |
| Support for multi-language  | Planned   |
| Retry with exponential backoff | Future |
| Attachment support (e.g., PDF) | Planned |

---

## 13. Questions?

- Slack: `#taly-serverless`
- Email: `notifications@taly.dev`

---
```