```md
# Developer Environment Setup for Taly CRM

Welcome to the Taly CRM project! This guide helps you set up a local development environment from scratch, using Docker, pnpm, and Node.js.

---

## Prerequisites

Ensure the following tools are installed **on your local machine**:

| Tool          | Version              | Notes                          |
|---------------|-----------------------|--------------------------------|
| Node.js       | `>= 22.14.0`          | Recommended via [nvm](https://github.com/coreybutler/nvm-windows) |
| pnpm          | `>= 10.4.0`           | Install via `npm i -g pnpm`    |
| Docker        | `>= 24.x`             | Docker Desktop for Windows/macOS |
| Git           | Latest stable         | Required for version control   |
| PowerShell    | 5.1+ / Windows Terminal | Preferred for Windows devs     |

---

## Repository Structure Overview

```
taly/
├── api/              # NestJS backend
├── apps/             # Next.js frontend apps
├── shared/           # Shared DTOs, types, utils
├── serverless/       # Serverless microfunctions
├── devops/           # CI/CD, Docker, infra-as-code
├── docs/             # Internal documentation
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/talyssonoliver/taly.git
cd taly
```

> Make sure you are in the root folder that contains `pnpm-workspace.yaml`.

---

## 2. Install Dependencies

```powershell
pnpm install
```

> This will install all workspace dependencies (frontend, backend, shared libs, serverless).

---

## 3. Configure Environment Variables

Use the provided `.env-example` files and copy them into the correct paths:

```powershell
# Backend API
Copy-Item -Path .\api\src\.env-example -Destination .\api\src\.env

# Edit and ensure at least:
# - DATABASE_URL
# - JWT_SECRET
# - NODE_ENV=development
```

Example for PostgreSQL:
```
DATABASE_URL=postgres://postgres:password@localhost:5432/taly
JWT_SECRET=dev_secret
NODE_ENV=development
```

---

## 4. Start Project with Docker Compose

Use Docker to start all dependencies (API, PostgreSQL, Dashboard):

```powershell
docker-compose -f docker-compose.yaml up --build
```

This will expose:
- API: [http://localhost:4000/api](http://localhost:4000/api)
- Frontend: [http://localhost:3000](http://localhost:3000)

To shut down:
```powershell
docker-compose -f docker-compose.yaml down
```

---

## 5. Prisma (Backend ORM)

### Generate Prisma Client

```powershell
cd .\api
pnpm run prisma:generate
```

### Run Migrations

```powershell
pnpm run prisma:migrate
```

### Seed Development Data

```powershell
pnpm run prisma:seed
```

---

## 6. Start Services Manually (Optional)

If you don’t want to use Docker for development:

### Backend (API)

```powershell
cd .\api
pnpm run start:dev
```

### Frontend (Dashboard)

```powershell
cd .\apps\dashboard
pnpm run dev
```

Make sure `API_URL=http://localhost:4000` is set in the frontend `.env.local`.

---

## 7. Lint, Format & Test

### Lint entire project

```powershell
pnpm run lint
```

### Format codebase

```powershell
pnpm run format
```

### Run tests

```powershell
pnpm run test
```

---

## 8. Debugging and Logs

- **Backend Logs:** Displayed in your terminal where `pnpm start:dev` is running
- **Database Logs:** Shown via Docker if you run `docker logs taly_postgres`
- **Frontend Logs:** Printed in the browser console and terminal

---

## 9. Useful Scripts

From the project root:

| Script           | Description                                |
|------------------|--------------------------------------------|
| `pnpm dev`       | Starts dev mode across all apps            |
| `pnpm build`     | Builds all apps                            |
| `pnpm test`      | Runs all tests                             |
| `pnpm lint`      | Runs ESLint checks                         |
| `pnpm run clean` | Removes all build, dist and cache files    |

---

## 10. Common Issues

- **Port already in use:** Stop the conflicting process or change port in `.env`
- **Database connection fails:** Check if Docker is running and DB is healthy
- **GraphQL playground is blank:** Ensure API is running at `/api`

---

## 11. Next Steps

Once your environment is up:

- Begin working on your assigned feature branch.
- Use `pnpm run lint` and `pnpm run test` before every commit.
- Follow coding standards and project guidelines.

---

## Need Help?

Join the team Slack channel or email `support@taly.dev`.

Happy coding!
```

---