```md
# Mailing Strategy – Taly CRM

This document defines the strategy for transactional and marketing emails across the Taly CRM platform. It includes email types, sending infrastructure, branding, personalisation, compliance considerations, and future automation plans.

---

## 1. Email Types

### A. Transactional Emails (System-Triggered)

| Type                        | Trigger Source                | Audience             |
|-----------------------------|-------------------------------|----------------------|
| Booking confirmation        | Appointment created           | End client           |
| Appointment reminder        | Scheduled job (24h before)    | End client           |
| Payment receipt             | Stripe payment succeeded      | End client           |
| Account registration        | Auth success or OAuth signup  | Company owner        |
| Password reset              | Manual request via login page | Company user         |
| Plan upgrade                | Stripe webhook event          | Company owner        |

---

### B. Operational Emails (Platform Notifications)

| Type                | Trigger                      | Audience             |
|---------------------|------------------------------|----------------------|
| Trial ending soon   | 3 days before trial expires  | Company owner        |
| Usage near limit    | Appointment limit reached    | Company owner        |
| Report delivered    | After PDF/CSV report is ready| Company owner        |

---

### C. Marketing Emails (One-to-Many)

| Type                      | Frequency       | Tool            |
|---------------------------|------------------|-----------------|
| Product announcements     | Monthly          | Mailchimp / Brevo |
| Onboarding email series   | Post-signup drip | Mailchimp        |
| Newsletter (opt-in only)  | Monthly or less  | Mailchimp        |
| Referral promotions       | Occasional       | Mailchimp        |

---

## 2. Sending Infrastructure

| Use Case         | Service        | Environment |
|------------------|----------------|-------------|
| Transactional    | **Amazon SES** | All         |
| Marketing        | Mailchimp (or Brevo) | Prod only   |
| Dev/testing      | MailDev / Mailtrap | Local/staging |

---

## 3. Domain & Deliverability

- Verified sending domain: `taly.dev`
- DKIM, SPF, and DMARC configured (via AWS Route 53 or Cloudflare)
- Dedicated IP (Planned for Premium tier email volumes)
- Emails sent from:
  - `noreply@taly.dev` (automated)
  - `support@taly.dev` (inbound replies)

---

## 4. Branding & Design Guidelines

- Use the primary purple (`#6F4EF2`) for headers and CTAs
- Fonts: Inter, system fallbacks
- Logo header + footer with:
  - App links
  - Company info
  - Contact / support

Templates are stored in:

```
serverless/send-email/templates/{lang}/
```

---

## 5. Personalisation Tokens

Templates support dynamic values via Handlebars:

```hbs
Hello {{fullName}},

Your booking for {{service}} on {{startTime}} has been confirmed.
```

Payloads are passed from backend or serverless triggers using:

```ts
context = {
  fullName: "Alice Smith",
  startTime: "2024-04-10T14:00:00Z",
  service: "Haircut"
};
```

---

## 6. Language Support

- Default locale: `en-GB`
- Fallback: English
- Planned: `pt-BR`, `fr-FR`, `es-ES`

Selected based on:
- Client profile
- Company default language
- Fallback to global config

---

## 7. Unsubscribe & Compliance

| Email Type         | Requires Unsubscribe? | Notes                         |
|--------------------|------------------------|-------------------------------|
| Transactional      | ❌                     | Essential to platform use     |
| Marketing          | ✅                     | Opt-in with unsubscribe link  |
| Operational        | ✅ (where applicable)  | Optional for non-critical     |

All marketing emails must include:
- Unsubscribe link (`{{unsubscribeUrl}}`)
- Company address
- GDPR-compliant footer

---

## 8. API Integration

Transactional emails are triggered via:

```ts
await notificationService.sendEmail({
  to: 'client@example.com',
  template: 'booking-confirmation',
  context: { fullName, service, startTime }
});
```

Frontend contact forms forward to:

```
POST /contact/support
```

Which relays to `support@taly.dev` via SES or SMTP proxy.

---

## 9. Future Plans

| Feature                       | Status    |
|-------------------------------|-----------|
| A/B testing of templates      | Planned   |
| Referral code email campaign  | Planned   |
| Resend email from dashboard   | Planned   |
| Behavioural drip campaigns    | Future    |
| Post-booking review request   | Future    |

---

## 10. Related Files

| File                                 | Purpose                           |
|--------------------------------------|-----------------------------------|
| `send-email/serverless.yml`          | Lambda configuration              |
| `templates/*.hbs`                    | Email markup per language         |
| `notification.service.ts`           | Backend-triggered email sender    |
| `mailchimp.config.ts` (Planned)     | Marketing campaign integration    |

---

## 11. Contacts

- Product: `product@taly.dev`
- Marketing Ops: `marketing@taly.dev`
- DevOps: `infra@taly.dev`

---
```