```md
# Internationalisation (i18n) Strategy – Taly CRM

This document outlines the strategy for supporting **multi-language** interfaces across the Taly CRM platform, including localisation in frontend apps, backend content preparation, and translation pipeline plans for supporting global user bases.

---

## 1. Goals

Taly CRM will progressively support localisation for:

- All **frontend apps** (Dashboard, Booking)
- **Email templates** sent to clients and users
- **System messages** (errors, notifications)
- (Planned) Customer-facing reports and receipts

---

## 2. Supported Languages (Initial Rollout)

| Code | Language         | Status    |
|------|------------------|-----------|
| `en-GB` | English (UK)      | Default   |
| `pt-BR` | Portuguese (Brazil)| Planned   |
| `fr-FR` | French (France)    | Future    |
| `es-ES` | Spanish (Spain)    | Future    |

---

## 3. Frontend Localisation (Next.js + i18next)

### Tools:
- `next-intl` (preferred) or `react-i18next`
- Locale detection via domain/subpath or browser
- Language files stored in:
  ```
  /apps/dashboard/messages/{locale}.json
  /apps/booking/messages/{locale}.json
  ```

### Example:

```tsx
const t = useTranslations();
t('appointments.confirmationTitle')
```

### Directory Example:

```
messages/
├── en-GB.json
├── pt-BR.json
└── fr-FR.json
```

---

## 4. Backend i18n

The backend (NestJS) will provide:

- Error codes + keys (not language-specific messages)
- Translation handled in frontend using i18n bundles
- Shared enums and error keys mapped to user-friendly strings

### Example:

```json
{
  "error.user.not_found": "User not found",
  "error.appointment.conflict": "This time slot is no longer available."
}
```

Returned by API as:

```json
{
  "statusCode": 409,
  "message": "error.appointment.conflict"
}
```

---

## 5. Email Templates

Handlebars-based templates will use i18n context injection.

### Example:

```hbs
<h1>{{t "email.booking.confirmation.title"}}</h1>
<p>{{t "email.booking.confirmation.body" fullName=startTime }}</p>
```

Emails will default to company’s preferred language or recipient profile.

Stored in:
```
/serverless/send-email/templates/{locale}/*.hbs
```

---

## 6. Booking Website Translation

- Locale is inferred from:
  - Browser language (`navigator.language`)
  - URL param (`?lang=pt-BR`)
  - Company default (`website.language`)
- Fallback: `en-GB`

---

## 7. Translation Keys Naming Convention

| Key Prefix         | Context                       |
|--------------------|-------------------------------|
| `app.*`            | Global interface               |
| `auth.*`           | Login, register, forgot        |
| `dashboard.*`      | UI navigation, labels          |
| `appointment.*`    | Booking flows                  |
| `error.*`          | Server messages & exceptions   |
| `email.*`          | Email content                  |

---

## 8. Translation Workflow

### Manual (Initial Phase)
- Keys maintained in `*.json` files
- Developers extract and update translations manually
- Missing keys flagged via dev console

### Future (Automated)
- Use tools like **Locize**, **Phrase**, or **Tolgee**
- GitHub sync for crowd-based or team-based translation
- CI check for missing or outdated keys

---

## 9. Accessibility & Right-to-Left (Planned)

| Feature           | Status |
|-------------------|--------|
| RTL (Arabic, Hebrew) | Future |
| Screen reader labels | Active |
| Localised metadata   | Planned |

---

## 10. Related Files

| File                                      | Purpose                                |
|-------------------------------------------|----------------------------------------|
| `apps/dashboard/messages/*.json`          | UI translations                        |
| `apps/booking/messages/*.json`            | Client-side messages                   |
| `shared/constants/error-codes.ts`         | Enum of backend error codes            |
| `send-email/templates/{lang}/*.hbs`       | Email translations                     |
| `website.language` field (DB)             | Default for booking page               |

---

## 11. Questions?

- Slack: `#taly-i18n`
- Email: `localisation@taly.dev`

---
```
