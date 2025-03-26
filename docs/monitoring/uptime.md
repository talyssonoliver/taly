```md
# Uptime Monitoring & Health Checks – Taly CRM

This document outlines how Taly CRM ensures system uptime through automated health checks, Kubernetes probes, and observability tools like Prometheus and Grafana. It covers backend availability, frontend reachability, service status endpoints, and failure alerting plans.

---

## 1. Objectives

- Continuously monitor core services (API, database, frontend)
- Detect downtime or degraded performance quickly
- Provide visibility via dashboards and alerts
- Allow orchestration platforms to self-heal unhealthy containers

---

## 2. Health Check Endpoints

### API Liveness

```http
GET /admin/ping
```

#### Response:
```json
{
  "status": "ok",
  "timestamp": "2024-04-01T13:00:00Z",
  "uptime": "12d 4h",
  "db": "healthy"
}
```

> Used by Kubernetes `livenessProbe` and external uptime checks.

---

## 3. Kubernetes Probes

| Probe Type       | Path           | Purpose                         |
|------------------|----------------|---------------------------------|
| `livenessProbe`  | `/admin/ping`  | Restart container if unresponsive |
| `readinessProbe` | `/admin/ping`  | Route traffic only when healthy |

### Example:

```yaml
livenessProbe:
  httpGet:
    path: /admin/ping
    port: 4000
  initialDelaySeconds: 10
  periodSeconds: 30
```

---

## 4. Frontend Availability

- Dashboard and booking apps are monitored via:
  - **Pingdom** or **UptimeRobot** (external)
  - **Browser-based uptime checks** (Planned)
- Example target: `https://dashboard.taly.dev`, `https://book.taly.dev`

---

## 5. Prometheus Integration (Planned)

### Metrics to expose:

| Metric                          | Description                     |
|----------------------------------|---------------------------------|
| `http_requests_total`           | Per route, method, status       |
| `http_response_duration_seconds`| Request latency histogram       |
| `nodejs_event_loop_lag_seconds` | NestJS server health indicator  |
| `db_connection_pool_usage`      | Number of DB connections in use |

### Metrics Endpoint (Planned):

```
GET /metrics
```

---

## 6. Grafana Dashboards (Planned)

Visual dashboards for:

- API request rates, error rates, latency
- DB connection health
- Booking traffic over time
- Stripe webhook delivery performance
- Uptime by environment (staging, prod)

---

## 7. Alerting

| Alert Condition                      | Action                      |
|--------------------------------------|-----------------------------|
| `/ping` returns 500 for >1 min       | PagerDuty/Slack alert       |
| Pod restarts >3x/hour                | Warn and log for review     |
| Booking drop detected (low volume)   | Product team notified       |
| DB pool saturated                    | Infra team alert            |

---

## 8. Tools Used

| Tool         | Role                        |
|--------------|-----------------------------|
| Kubernetes   | Container orchestration     |
| Prometheus   | Metrics scraping (Planned)  |
| Grafana      | Visual dashboards (Planned) |
| Pingdom/UptimeRobot | External uptime checks |
| CloudWatch   | Logs and Lambda status      |

---

## 9. Related Files

| File                      | Purpose                        |
|---------------------------|--------------------------------|
| `admin.controller.ts`     | Contains `/ping` endpoint      |
| `api-deployment.yaml`     | Sets up liveness/readiness probes |
| `prometheus.yaml`         | (Planned) Metrics scraping rules |
| `dashboard-monitor.json`  | (Planned) Grafana config       |

---

## 10. Questions?

- Slack: `#taly-observability`
- Email: `infra@taly.dev`

---
```
