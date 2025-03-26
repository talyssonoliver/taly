```md
# Architecture: Service Boundaries – Monolith, Microservices, and Serverless

This document explains how the Taly CRM system is architected around **clear service boundaries**, combining a modular monolith (NestJS), microservice-like separation (via modules/domains), and complementary **serverless functions** for async or isolated workflows.

---

## 1. High-Level Architecture

| Layer              | Technology      | Purpose                             |
|--------------------|------------------|-------------------------------------|
| Web Frontends      | Next.js (App Router) | Booking, Dashboard, Payments   |
| Core Backend       | NestJS Monolith | Auth, Appointments, Users, Payments |
| Serverless         | AWS Lambda       | Emails, Reports, Logging, Async Jobs |
| Database           | PostgreSQL       | Main transactional datastore        |
| Queues (Planned)   | AWS SQS          | Async coordination (future)         |

---

## 2. Modular Monolith (NestJS)

The backend (`/api`) is a **modular monolith** that:

- Uses Domain-Driven Design (DDD) principles
- Has strict folder/module boundaries (e.g. `appointments`, `payments`, `subscriptions`)
- Encapsulates business logic within each domain

> All modules use shared infrastructure (e.g. logging, database, guards) but are **independently testable and loosely coupled**.

---

## 3. Serverless Functions

Isolated logic that benefits from being async, stateless, or independently deployable is extracted to Lambda functions:

| Function            | Purpose                                |
|---------------------|----------------------------------------|
| `send-email`        | Deliver transactional email via SES    |
| `generate-reports`  | Create and export CSV/PDF data         |
| `activity-logger`   | Record user/system-level audit trails  |
| `queue-processor`   | (Planned) Job queue handler for retries |

These:
- Avoid blocking the core API
- Run independently on demand or on schedule
- Can scale independently of the monolith

---

## 4. Communication Boundaries

| Interaction         | Type              | Method                          |
|---------------------|-------------------|---------------------------------|
| Frontend → Backend  | Synchronous       | REST / GraphQL (via Axios)      |
| Backend → Serverless| Asynchronous (Planned) | HTTP or Event/Queue (SQS/EventBridge) |
| Backend → DB        | Synchronous       | Prisma ORM                      |
| Serverless → S3     | Direct Integration| SDK access via IAM              |

---

## 5. Domain Responsibilities

| Domain        | Ownership         | Layer                       | Deployment Type |
|---------------|-------------------|------------------------------|-----------------|
| Auth          | Core Monolith     | Users, JWT, Roles            | API             |
| Appointments  | Core Monolith     | Booking, slots, reminders    | API             |
| Payments      | Core Monolith     | Stripe, plan limits          | API             |
| Notifications| Serverless         | Email, SMS delivery          | Lambda          |
| Reports       | Serverless        | Exports, dashboards          | Lambda          |
| Logs          | Serverless        | Immutable activity tracking  | Lambda          |
| Domains       | Booking Website   | Public website per company   | API + Frontend  |

---

## 6. Separation Justification

| Module                 | Reason for Monolith | Reason for Serverless |
|------------------------|---------------------|------------------------|
| Auth / RBAC            | Tight API coupling  | N/A                    |
| Booking / Payments     | Transactional logic | N/A                    |
| Emails / Notifications | Delay-tolerant      | Scales independently   |
| PDF / Report export    | CPU/memory heavy    | Avoids blocking API    |
| Activity logs          | Append-only, async  | S3/queue-friendly      |

---

## 7. Benefits of This Hybrid Model

- **Faster dev cycle**: Single backend codebase for core logic
- **Scalable workflows**: Offload heavy/async flows to Lambda
- **Isolated deployment**: Update reporting/email infra without affecting users
- **Easy migration path**: Individual modules can be extracted if needed

---

## 8. Deployment Summary

| Component         | Location             | Deployed via      |
|------------------|----------------------|-------------------|
| API (NestJS)     | `/api`               | Docker/Kubernetes |
| Dashboard UI     | `/apps/dashboard`    | Vercel/ECS        |
| Booking UI       | `/apps/booking`      | Static / CDN      |
| Lambdas          | `/serverless/*`      | Serverless Framework |
| DB               | PostgreSQL (RDS/Local)| Terraform (future)|

---

## 9. Future Boundaries (Planned)

| Goal                         | Strategy                  |
|------------------------------|---------------------------|
| Message queues               | SQS, SNS, or EventBridge  |
| Job retry + failure tracking | DLQ for Lambdas           |
| Independent reports API      | Split reporting as microservice |
| Tenant isolation for Premium | Dedicated namespaces      |

---

## 10. Questions?

- Slack: `#taly-architecture`
- Email: `architecture@taly.dev`

---
```
