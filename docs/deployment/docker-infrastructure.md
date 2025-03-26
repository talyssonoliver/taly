```md
# Docker Infrastructure Overview

This document explains how Docker is used to containerise and orchestrate the local development stack for Taly CRM. It includes service definitions, networking, volume mappings, environment configuration, and troubleshooting.

---

## 1. Overview

Taly uses **Docker Compose** for local development to manage services:

- `backend` (NestJS API)
- `frontend` (Next.js dashboard)
- `db` (PostgreSQL 15)
- (Planned: Redis, MailDev)

All services are defined in:

```yaml
Path: /docker-compose.yaml
```

---

## 2. Service Overview

### **1. Backend**

| Key        | Value                          |
|------------|-------------------------------|
| Path       | `./api/`                       |
| Dockerfile | `./api/Dockerfile`            |
| Port       | `4000:4000`                    |
| Env Vars   | `DATABASE_URL`, `JWT_SECRET`  |
| Depends On | `db`                           |
| Volumes    | `./api:/app` (live reload)    |

---

### **2. Frontend**

| Key        | Value                          |
|------------|-------------------------------|
| Path       | `./apps/dashboard/`           |
| Dockerfile | `./apps/dashboard/Dockerfile` |
| Port       | `3000:3000`                    |
| Env Vars   | `API_URL=http://localhost:4000` |
| Depends On | `backend`                      |
| Volumes    | `./apps/dashboard:/app`       |

---

### **3. Database (PostgreSQL)**

| Key         | Value                        |
|-------------|-----------------------------|
| Image       | `postgres:15-alpine`        |
| Container   | `taly_postgres`             |
| Port        | `5432:5432`                 |
| Credentials | `postgres:password`         |
| DB Name     | `taly`                      |
| Volume      | `db_data:/var/lib/postgresql/data` |

---

## 3. Usage

### Start Containers

```powershell
docker-compose -f docker-compose.yaml up --build
```

> This will:
- Build the frontend and backend images
- Start PostgreSQL container
- Mount volumes for live code reload

### Stop & Remove

```powershell
docker-compose -f docker-compose.yaml down
```

> This removes containers but retains volumes.

### Reset DB Volume (hard reset)

```powershell
docker volume rm taly_db_data
```

---

## 4. File Overview

### `docker-compose.yaml`

Located at:
```
C:\taly\dir-taly\taly\docker-compose.yaml
```

### Dockerfiles

- **Backend**: `./api/Dockerfile`
- **Dashboard**: `./apps/dashboard/Dockerfile`

Each Dockerfile defines how to build the service using:
- Node 22 base image
- `pnpm install`
- `pnpm run start:dev` (dev mode)

---

## 5. Volumes & Live Reload

Each service mounts source code:

```yaml
volumes:
  - ./api:/app
  - /app/node_modules
```

This enables hot-reload and avoids dependency conflicts inside the container.

> Tip: Do not manually modify `node_modules` inside Docker containers.

---

## 6. Network

All services share the default `bridge` network:

- `backend` can reach `db` using the hostname `db`
- `frontend` calls backend at `http://localhost:4000`

> DNS is handled by Docker automatically via service names.

---

## 7. Troubleshooting

| Problem | Solution |
|--------|----------|
| `EACCES: permission denied` | Check volume mounts and file permissions |
| `Connection refused` to DB | Ensure db container is healthy; check logs |
| Changes not reflected in browser | Restart service or clear cache |
| `pnpm install` fails in container | Clear Docker build cache and rebuild |
| PostgreSQL volume corrupt | Run `docker volume rm taly_db_data` and restart |
| CORS error in frontend | Backend must include CORS config (`*` for dev) |

---

## 8. Planned Enhancements

| Feature         | Description                                  |
|----------------|----------------------------------------------|
| Redis Service   | For caching, rate-limiting, notification queues |
| MailDev Container | View outgoing emails in development         |
| Docker Health Checks | Improve reliability and restart strategy |
| Named Networks  | Define a project-scoped Docker network       |
| Dev Containers (VSCode) | Enable remote dev environments         |

---

## 9. Related Commands

### Rebuild Images

```powershell
docker-compose -f docker-compose.yaml build --no-cache
```

### View Logs

```powershell
docker-compose -f docker-compose.yaml logs -f
```

### Inspect DB Directly

```powershell
docker exec -it taly_postgres psql -U postgres -d taly
```

---

## 10. References

| File | Purpose |
|------|---------|
| `docker-compose.yaml` | Service configuration |
| `Dockerfile` (api)    | Backend build process |
| `Dockerfile` (dashboard) | Frontend build process |
| `.env` (optional)     | Local variable overrides |

---

## Contact

If you're having trouble running the stack, reach out via:

- Slack: `#taly-devops`
- Email: `infra@taly.dev`

---
```