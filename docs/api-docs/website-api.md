```md
# Website API Documentation

This document outlines the endpoints and configuration logic behind the custom booking websites generated for each business using Taly CRM. Premium and Pro users can configure a branded public site where clients can view services, availability, and schedule appointments.

---

## 1. Overview

| Endpoint                         | Method | Auth Required | Description                           |
|----------------------------------|--------|----------------|---------------------------------------|
| `/website/:companySlug`         | GET    | No             | Fetch public website config           |
| `/website/:companySlug/preview` | GET    | Yes (Owner)    | Preview current theme/customisation   |
| `/website`                      | POST   | Yes (Owner)    | Create or update website config       |
| `/website/theme`                | PATCH  | Yes (Owner)    | Update colours, fonts, or layout      |
| `/website/domain`               | PATCH  | Yes (Premium)  | Add custom domain                     |

> Access to `/website` endpoints is gated by the company’s subscription tier and role.

---

## 2. Website Configuration Model

Each company can configure:

- **Slug**: used to generate public URL: `book.taly.dev/{slug}`
- **Theme**: colours, layout, buttons
- **Content**: business description, contact info
- **Domain**: optional custom domain (Premium only)

Stored in `websites` table, linked to `companyId`.

---

## 3. `GET /website/:companySlug`

Fetch a company’s public website configuration.

### Response:
```json
{
  "companyName": "Glow Hair Studio",
  "slug": "glow-hair",
  "theme": {
    "primaryColor": "#FF3366",
    "font": "Inter",
    "layout": "classic"
  },
  "contact": {
    "phone": "+447911123456",
    "email": "hello@glowhair.co.uk",
    "address": "123 Queen Street, London"
  },
  "services": [
    { "name": "Haircut", "price": 30 },
    { "name": "Blowdry", "price": 25 }
  ]
}
```

Used by `apps/booking` to render the public-facing site.

---

## 4. `POST /website`

Create or update the website entry for the current user’s company.

### Request:
```json
{
  "slug": "glow-hair",
  "description": "A premium hair salon in central London",
  "phone": "+447911123456",
  "email": "hello@glowhair.co.uk",
  "address": "123 Queen Street, London"
}
```

---

## 5. `PATCH /website/theme`

Update visual branding options.

### Request:
```json
{
  "primaryColor": "#FF3366",
  "secondaryColor": "#222",
  "font": "Poppins",
  "layout": "modern"
}
```

> Theme is applied in real-time in `apps/booking`.

---

## 6. `PATCH /website/domain` (Premium Only)

Link a custom domain (e.g. `book.glowhair.co.uk`).

### Request:
```json
{
  "domain": "book.glowhair.co.uk"
}
```

### Behaviour:
- Validates ownership (via DNS or admin confirmation)
- Configures domain routing via AWS/Cloudflare
- Stores `domain` field on the website config

---

## 7. Permissions

| Feature             | Free | Pro | Premium |
|---------------------|------|-----|---------|
| Use default slug    | ✅   | ✅  | ✅      |
| Branding theme      | ❌   | ✅  | ✅      |
| Custom domain       | ❌   | ❌  | ✅      |
| Website preview     | ❌   | ✅  | ✅      |
| Layout variations   | ❌   | ✅  | ✅      |

---

## 8. Frontend Integration

- Booking app reads:
  - `/website/:slug` to fetch branding and business info
- Fallback to default branding if config is missing
- SSR-compatible and SEO-optimised

---

## 9. DNS Setup (Premium Only)

User must:
1. Add CNAME pointing to `book.taly.dev`
2. Confirm domain ownership
3. Taly provisions SSL certificate and updates routing

Automated via:
- AWS Route 53 / Cloudflare
- ACME + cert-manager (Kubernetes ingress)

---

## 10. Related Files

| File                           | Purpose                                |
|--------------------------------|----------------------------------------|
| `website.controller.ts`       | Public & private endpoints              |
| `website.service.ts`          | CRUD, validation, DNS integration       |
| `website.entity.ts`           | DB model and GraphQL type               |
| `apps/booking/layout.tsx`     | Applies fetched theme to UI             |
| `@shared/types/website.ts`    | Shared config between backend/frontend  |

---

## 11. Planned Enhancements

| Feature                | Status    |
|------------------------|-----------|
| Live preview editor    | In design |
| Theme templates        | Planned   |
| Meta tag + OpenGraph   | Planned   |
| Custom fonts upload    | Planned   |
| Visitor analytics      | Future    |

---

## 12. Questions?

- Slack: `#taly-frontend`
- Email: `websites@taly.dev`

---
```