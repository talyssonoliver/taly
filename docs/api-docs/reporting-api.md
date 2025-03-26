```md
# Reporting API Documentation

This document outlines the endpoints and logic behind the reporting and analytics system in Taly CRM. Reports provide actionable insights to company owners and staff based on bookings, payments, clients, and services.

---

## 1. Overview

| Endpoint             | Method | Auth Required | Description                         |
|----------------------|--------|----------------|-------------------------------------|
| `/reports/summary`   | GET    | Yes            | High-level business KPIs            |
| `/reports/bookings`  | GET    | Yes            | Booking volume report               |
| `/reports/clients`   | GET    | Yes            | Top clients by visits/spend         |
| `/reports/revenue`   | GET    | Yes            | Revenue breakdown by date/service   |
| `/reports/export`    | GET    | Yes            | Download report (CSV or PDF)        |

> All endpoints require role `ADMIN` or `STAFF`. Data is scoped by `companyId`.

---

## 2. Summary Report – `GET /reports/summary`

Returns core metrics for dashboard KPIs.

### Response:
```json
{
  "revenue": 15200.75,
  "appointments": 312,
  "newClients": 48,
  "topService": "Haircut"
}
```

---

## 3. Booking Report – `GET /reports/bookings`

Returns appointment counts over time.

### Query Parameters:
- `startDate`, `endDate`: ISO strings
- `interval`: `daily`, `weekly`, `monthly`

### Response:
```json
[
  { "label": "2024-03-01", "appointments": 12 },
  { "label": "2024-03-02", "appointments": 16 },
  ...
]
```

---

## 4. Client Report – `GET /reports/clients`

Returns top clients ranked by visits or spend.

### Query Parameters:
- `sortBy`: `visits` (default) or `revenue`
- `limit`: number of results (default: 10)

### Response:
```json
[
  {
    "client": {
      "fullName": "Alice Smith",
      "email": "alice@example.com"
    },
    "appointments": 8,
    "revenue": 420
  },
  ...
]
```

---

## 5. Revenue Report – `GET /reports/revenue`

Returns earnings grouped by date, service, or staff.

### Query Parameters:
- `groupBy`: `date`, `service`, `staff`
- `startDate`, `endDate`: ISO format

### Example Response (grouped by service):
```json
[
  {
    "label": "Haircut",
    "revenue": 3200,
    "appointments": 102
  },
  {
    "label": "Massage",
    "revenue": 1400,
    "appointments": 40
  }
]
```

---

## 6. Export Reports – `GET /reports/export`

Generates downloadable PDF or CSV version of a report.

### Query Parameters:
- `type`: `summary`, `bookings`, `revenue`, `clients`
- `format`: `pdf` or `csv`

### Response:
- Content-Disposition: `attachment; filename="report.pdf"`
- Binary file buffer

---

## 7. GraphQL Example

```graphql
query {
  reportSummary {
    revenue
    appointments
    newClients
    topService
  }

  revenueByService(startDate: "2024-03-01", endDate: "2024-03-31") {
    label
    revenue
    appointments
  }
}
```

---

## 8. Security & Access

- Role-based access enforced via `@RolesGuard`
- Company-scoped filtering via `CurrentUser().companyId`
- Export endpoints are rate-limited (max 10/day/user)

---

## 9. Visualisation Guidance (Frontend)

Use:
- `Chart.js` or `Recharts` for graphs
- `react-csv` or `jsPDF` for local export fallback
- `react-query` to cache results per interval/grouping

---

## 10. Related Files

| File                        | Purpose                          |
|-----------------------------|----------------------------------|
| `reports.controller.ts`     | REST endpoint controller         |
| `reports.service.ts`        | Aggregation logic                |
| `report-summary.dto.ts`     | DTO for summary response         |
| `reports.resolver.ts`       | GraphQL support                  |
| `report-export.util.ts`     | PDF/CSV formatter                |

---

## 11. Planned Enhancements

| Feature                     | Status  |
|-----------------------------|---------|
| Scheduled reports by email | Planned |
| Multi-salon comparison     | Future  |
| Staff performance dashboard| Planned |
| Filters by service category| Planned |

---

## 12. Questions?

- Slack: `#taly-data`
- Email: `reports@taly.dev`

---
```