```md
# Webhook Security & Processing – Taly CRM

This document outlines how external webhooks are received, verified, processed, and monitored in the Taly CRM platform. It covers integration with providers like **Stripe**, **Twilio**, **SES**, and future services, with a focus on security and reliability.

---

## 1. Purpose of Webhooks

Taly receives incoming webhooks to:

- Sync payment events from **Stripe**
- Handle SMS delivery events from **Twilio**
- Track email bounces and opens from **Amazon SES**
- (Future) Handle push delivery receipts from FCM

---

## 2. Webhook Entry Points

| Provider | Endpoint                      | Method | Auth         |
|----------|-------------------------------|--------|--------------|
| Stripe   | `/webhooks/stripe`            | POST   | Signature verified |
| Twilio   | `/webhooks/twilio`            | POST   | IP-verified or HMAC |
| SES      | `/webhooks/ses`               | POST   | Signature-verified |
| Internal | `/webhooks/internal/:event`   | POST   | Token or service key |

---

## 3. Stripe Webhooks

### Endpoint: `/webhooks/stripe`

| Event Type                | Action                                      |
|---------------------------|---------------------------------------------|
| `checkout.session.completed` | Activate plan, mark payment success       |
| `invoice.payment_failed`     | Notify user, retry payment                |
| `customer.subscription.updated` | Update plan tier in DB               |

### Security:

- Signature verified with `stripe.webhooks.constructEvent(...)`
- Secret stored in `.env` as `STRIPE_WEBHOOK_SECRET`
- Replay protection enforced via `event.id` deduplication

---

## 4. Twilio Webhooks

### Endpoint: `/webhooks/twilio`

Used to track delivery of SMS messages.

- Uses `X-Twilio-Signature` header
- Validated with Twilio SDK + shared secret
- Events like `delivered`, `undelivered`, `failed` trigger audit logs or retries

---

## 5. SES Webhooks (Bounces & Complaints)

### Endpoint: `/webhooks/ses`

- Handles bounce, complaint, delivery notifications
- JSON format verified via AWS SNS signature
- Used to mark emails as undeliverable and update `email_status`

---

## 6. Internal Webhooks (Optional)

### Endpoint: `/webhooks/internal/:event`

Used by other Taly services (e.g. serverless functions) to trigger workflows.

- Authenticated with `X-Service-Token`
- Token checked against secret in `.env`
- Example:
  - `/webhooks/internal/report-completed`
  - `/webhooks/internal/activity-logged`

---

## 7. Security Guidelines

| Measure                      | Applied |
|------------------------------|---------|
| Signature verification       | ✅       |
| IP whitelisting (where possible) | ✅   |
| Replay attack protection     | ✅       |
| Logging all webhook events   | ✅       |
| Rate limiting / throttling   | ✅       |
| Payload validation (Zod)     | ✅       |

---

## 8. Error Handling & Retries

- Failed webhook handlers return `5xx`
- Most providers auto-retry up to N times (e.g., Stripe: 3 attempts over 72h)
- Manual retry supported via admin tooling (Planned)

Webhook errors are logged to:

```
/logs/webhooks/errors/YYYY-MM-DD.log
```

---

## 9. Monitoring & Alerting

| Feature       | Status   |
|---------------|----------|
| Log webhook failures   | ✅ via logger service |
| Slack alert on webhook 500s | Planned |
| Dashboard of last webhook events | Planned |
| Alert on Stripe plan mismatch | Planned |

---

## 10. Testing Webhooks Locally

Use Stripe CLI:

```bash
stripe listen --forward-to localhost:4000/webhooks/stripe
```

Mock SES or Twilio with Postman or local test scripts:

```bash
curl -X POST http://localhost:4000/webhooks/ses -H 'Content-Type: application/json' -d @mock-bounce.json
```

---

## 11. Related Files

| File                         | Purpose                             |
|------------------------------|-------------------------------------|
| `webhooks.controller.ts`     | Central webhook receiver            |
| `stripe-webhook.service.ts`  | Stripe-specific logic               |
| `twilio-webhook.service.ts`  | SMS status updates                  |
| `ses-webhook.service.ts`     | Bounce/complaint processing         |
| `auth/middleware/webhook-token.guard.ts` | Internal token auth    |

---

## 12. Questions?

- Slack: `#taly-integrations`
- Email: `webhooks@taly.dev`

---
```