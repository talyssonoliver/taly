```md
# Taly CRM Branding & UI Style Guide

This document defines the core branding elements and design system rules for Taly CRM. It ensures consistency across the platform’s UI, custom booking websites, marketing material, and communications.

---

## 1. Brand Identity

### Brand Name: **Taly**
- Style: Always capitalised ("Taly", never "taly" or "TALY")
- Used for: App, emails, domain (`taly.dev`), product mentions

### Tagline (optional):
> “Smart scheduling. Beautifully simple.”

---

## 2. Colours

### Primary Palette

| Name           | Hex       | Usage                   |
|----------------|-----------|--------------------------|
| Primary        | `#6F4EF2` | Buttons, accents         |
| Secondary      | `#222222` | Text, navigation         |
| Background     | `#F8F9FB` | App background           |
| Success        | `#00C48C` | Confirmation, paid badge |
| Warning        | `#FFC542` | Plan limit nearing       |
| Error          | `#FF6B6B` | Validation, danger zones |

> Colours are stored as design tokens in Tailwind config (`tailwind.config.ts`).

---

## 3. Typography

### Default Font:
- **Inter** (used across apps and booking sites)
- Fallbacks: `system-ui, sans-serif`

### Font Sizes:

| Token       | Size     | Use Case             |
|-------------|----------|----------------------|
| `text-lg`   | 18px     | Headlines, buttons   |
| `text-base` | 16px     | Body text            |
| `text-sm`   | 14px     | Secondary content    |
| `text-xs`   | 12px     | Labels, footnotes    |

Font weights follow Tailwind defaults (`font-medium`, `font-semibold`, etc.).

---

## 4. Logos

- **Primary Logo**: Horizontal with wordmark (SVG)
- **Icon Only**: Rounded icon with "T" or full dot
- **Monochrome / Inverted** versions available

> Stored in: `public/assets/branding/`  
> Naming: `logo.svg`, `logo-white.svg`, `favicon.ico`

---

## 5. UI Components (shadcn/ui)

We use **shadcn/ui** components built on Radix UI and Tailwind.

### Component Design Principles:
- Accessible by default
- Configurable via props + Tailwind variants
- Themed via design tokens (`primaryColor`, etc.)
- Mobile responsive out-of-the-box

---

## 6. Tone of Voice

| Tone Element     | Guideline                              |
|------------------|-----------------------------------------|
| Friendly         | Speak like a helpful expert             |
| Concise          | Avoid jargon and filler                 |
| Confident        | Write with clarity and trust            |
| Personal         | Use names and human language when possible |

---

## 7. Booking Website Style Rules

- Theme is defined per salon (Pro and Premium plans)
- Options:
  - Primary colour (`#hex`)
  - Layout (`classic`, `modern`, `minimal`)
  - Font (`Inter`, `Poppins`, `Roboto`)
- Previewed via `/website/:slug/preview`

> Frontend themes are generated from dynamic Tailwind classes.

---

## 8. Assets & Usage Guidelines

| Asset            | Rule                              |
|------------------|-----------------------------------|
| Logo             | Do not stretch or recolour        |
| Icon             | Minimum 32x32 resolution           |
| Backgrounds      | Use subtle grey or white           |
| Illustrations    | Use outlined or flat style         |

---

## 9. Email Style

| Element      | Rule                                         |
|--------------|----------------------------------------------|
| Header       | Use `logo-white.svg` on purple background     |
| Font         | System fallback with 16px size               |
| Buttons      | Solid purple (`#6F4EF2`) with white text     |
| Footer       | Include company name, address, unsubscribe (where required) |

> Templates defined in `serverless/send-email/templates/{lang}/`.

---

## 10. Developer Integration

- Shared theme tokens are available in:
  ```
  @shared/constants/theme.ts
  shared-ui/config/tokens.ts
  tailwind.config.ts
  ```
- Booking themes loaded via `/website/:slug`
- Admin UI themes are static (controlled by core palette)

---

## 11. Related Files

| File                               | Purpose                    |
|------------------------------------|----------------------------|
| `tailwind.config.ts`               | Design tokens, breakpoints |
| `shared-ui/components/ui/*.tsx`    | Styled component wrappers  |
| `public/assets/branding/`          | Logos, icons, favicons     |
| `website.config.ts`                | Booking website theme map  |

---

## 12. Questions?

- Slack: `#taly-design`
- Email: `brand@taly.dev`

---
```