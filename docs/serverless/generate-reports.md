Here is the complete content for the file:
```md
# Serverless Function: generate-reports

This document outlines the design and functionality of the `generate-reports` serverless function in the Taly CRM system. It automates the creation and delivery of business reports in PDF or CSV format, allowing asynchronous access to heavy data queries without impacting the main API runtime.

---

## 1. Purpose

The `generate-reports` function allows:

- Exporting revenue, appointments, and client reports
- Scheduling periodic summary reports (Planned)
- Generating PDF/CSV files on demand
- Emailing or storing the report in a CDN or S3 bucket

---

## 2. Runtime & Platform

| Platform     | Runtime   | Deployment Tool |
|--------------|-----------|------------------|
| AWS Lambda   | Node.js 18 | Serverless Framework |
| Trigger      | HTTP (secured), Planned: Cron |
| Output       | PDF or CSV streamed or emailed |

---

## 3. Endpoint

```http
POST /generate-reports
```

### Headers:
- `Authorization: Bearer <internal-api-token>`

### Payload:

```json
{
  "companyId": "uuid",
  "type": "revenue",
  "format": "pdf",
  "range": {
    "startDate": "2024-03-01",
    "endDate": "2024-03-31"
  },
  "emailTo": "owner@company.com"
}
```

---

## 4. Supported Report Types

| Type        | Description                    |
|-------------|--------------------------------|
| `revenue`   | Total revenue grouped by date/service |
| `bookings`  | Appointments within date range |
| `clients`   | Top clients by spend/visits    |
| `summary`   | Business KPIs + overview       |

---

## 5. Formats

| Format | Output          | Description                          |
|--------|------------------|--------------------------------------|
| `pdf`  | Printable table  | PDF with charts and summary          |
| `csv`  | Tabular data     | Raw data for Excel / Google Sheets   |

---

## 6. Output & Delivery

- Default output is a **buffered response**
- If `emailTo` is provided:
  - The report is emailed via SES
  - Attached to an email template: `report-delivery`
- Optionally, the file can be uploaded to **S3/CDN** and link returned

---

## 7. Environment Variables

```env
AWS_REGION=eu-west-1
S3_REPORT_BUCKET=taly-report-exports
EMAIL_REPORT_FROM=reports@taly.dev
JWT_SECRET=...
```

Used for email delivery, S3 storage, and internal auth.

---

## 8. Report Generation Workflow

```mermaid
graph TD;
  A[Trigger Function] --> B[Query ReportService]
  B --> C[Format as PDF/CSV]
  C --> D[Save to S3 (if enabled)]
  C --> E[Attach to email (if emailTo)]
  E --> F[Send via SES]
  D --> G[Return URL or File buffer]
```

---

## 9. Local Development

```bash
cd serverless/generate-reports
pnpm install
pnpm run build

sls invoke local -f generateReports --data '{}'
```

---

## 10. Deployment

```bash
sls deploy --stage production
```

Uses `serverless.yml` with defined IAM permissions for S3 and SES.

---

## 11. Related Files

| File                             | Purpose                             |
|----------------------------------|-------------------------------------|
| `handler.ts`                     | Lambda entry point                  |
| `report.service.ts`             | DB queries and aggregation          |
| `pdf-generator.ts`              | Chart and layout rendering          |
| `csv-generator.ts`              | Delimiter-based export logic        |
| `serverless.yml`                | Function definition + env setup     |
| `email.templates/report-delivery.hbs` | Report delivery email content   |

---

## 12. Planned Enhancements

| Feature                     | Status    |
|-----------------------------|-----------|
| Cron-based weekly exports   | Planned   |
| Slack/Telegram delivery     | Future    |
| Zip archive bundling        | Planned   |
| Report caching              | Future    |
| Self-serve portal to view exports | Planned |

---

## 13. Security

- Token-based internal access only
- Auth middleware checks JWT or service token
- Report export links expire after 24h (if public)

---

## 14. Questions?

- Slack: `#taly-serverless`
- Email: `reports@taly.dev`

---
```