```md
# Frontend Setup Guide – Taly CRM

This guide will walk you through setting up and running the **frontend applications** in the Taly CRM monorepo. The apps are built with **Next.js (App Router)**, **Tailwind CSS**, **shadcn/ui**, **React Query**, **Zustand**, and use **pnpm workspaces** to manage shared dependencies.

---

## Overview

Taly's frontend is structured into multiple apps:

```
apps/
├── dashboard/    # Admin & internal staff panel (main app)
├── booking/      # Public booking interface for clients
├── payments/     # (Optional) Payment UI, may merge with dashboard
├── shared-ui/    # Reusable UI components and hooks
```

---

## 1. Prerequisites

Ensure you have the following installed:

| Tool      | Version     |
|-----------|-------------|
| Node.js   | `>= 22.14.0` |
| pnpm      | `>= 10.4.0` |
| Docker    | optional, for full stack |
| Git       | latest      |

---

## 2. Install Dependencies

From the project root:

```powershell
cd C:\taly\dir-taly\taly
pnpm install
```

This will install all frontend packages across the monorepo using workspace support.

---

## 3. Environment Variables

Each frontend app uses `.env.local`.

### Example (`apps/dashboard/.env.local`):

```
API_URL=http://localhost:4000
NODE_ENV=development
```

> Make sure the backend is running and accessible at the value of `API_URL`.

---

## 4. Run the Dashboard App

```powershell
cd C:\taly\dir-taly\taly\apps\dashboard
pnpm run dev
```

- App runs on: [http://localhost:3000](http://localhost:3000)
- Built with Next.js 14 using App Router and Server Components
- React Query handles data fetching and caching
- Zustand handles global state (auth, settings)

---

## 5. Booking App (Public Client Side)

```powershell
cd C:\taly\dir-taly\taly\apps\booking
pnpm run dev
```

- Client-facing booking interface for appointments
- Planned features:
  - Choose service
  - Select time
  - Enter client info
  - Confirm booking

---

## 6. Development Features

### Tailwind + shadcn/ui

- Design system built with Tailwind
- Custom components in `apps/shared-ui`
- Themes and variants supported

To preview a component:

```tsx
import { Button } from '@shared-ui/components';
<Button variant="default">Click Me</Button>
```

### Axios Setup

Shared Axios client is configured in:

```
apps/dashboard/src/lib/axios.ts
```

Includes:
- Error handling
- Retry logic
- Token injection
- Base URL from `API_URL` in `.env.local`

### Zod Validation

All forms use `zod` schemas, e.g.:

```ts
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
```

---

## 7. Useful Scripts

| Command        | Description                            |
|----------------|----------------------------------------|
| `pnpm dev`     | Starts dev server (Next.js)            |
| `pnpm build`   | Builds production output               |
| `pnpm lint`    | Lints code with ESLint                 |
| `pnpm format`  | Formats with Prettier                  |
| `pnpm test`    | Runs unit tests (Jest + RTL)           |

---

## 8. Project Conventions

- Use `zod` for form validation
- Use `react-query` for all API calls
- Use `zustand` for shared global state (auth, settings)
- Use `@/` alias for imports inside the app
- Do not directly use `fetch`; always use `axios`

---

## 9. API Integration

- Backend API lives at `http://localhost:4000/api`
- Requests use:
  - `Authorization: Bearer <token>` header
  - Pagination: `?page=1&limit=10`
  - GraphQL requests go to `http://localhost:4000/graphql`

---

## 10. Folder Structure (Dashboard)

```
apps/dashboard/
├── app/                # Next.js App Router pages
│   ├── dashboard/      # Protected dashboard pages
│   ├── auth/           # Login/register
├── components/         # UI components
├── lib/                # Axios, utils, config
├── hooks/              # Custom hooks
├── services/           # API services (calls + zod validation)
├── store/              # Zustand stores
├── styles/             # Tailwind config, globals
├── public/             # Static assets
```

---

## 11. Testing

### Run Unit Tests

```powershell
pnpm run test
```

Tests are located inside:
- `__tests__/`
- `components/*.test.tsx`
- `hooks/*.test.ts`

Uses:
- `@testing-library/react`
- `jest`
- `msw` (optional for mocking)

---

## 12. Linting & Formatting

From the root:

```powershell
pnpm run lint
pnpm run format
```

Uses:
- ESLint with Prettier
- Auto formatting on commit via husky

---

## 13. CI/CD Integration

Frontend builds and tests are handled by:

```
.github/workflows/frontend-ci.yml
```

Pipeline steps:
- Install deps
- Lint code
- Run unit tests
- Build with Next.js
- Upload `.next/` as artifact

---

## 14. Troubleshooting

| Problem                     | Solution                                |
|----------------------------|-----------------------------------------|
| API 401 Unauthorized       | Login again or check expired token      |
| Network Error (axios)      | Check if backend API is running         |
| Tailwind not applied       | Confirm import in `globals.css`         |
| Shared component not found | Rebuild `shared-ui`, restart dev server |

---

## 15. Questions?

For support, contact:
- Frontend Team: `@frontend-team`
- Slack: `#taly-frontend`
- Email: `dev@taly.dev`

---
```