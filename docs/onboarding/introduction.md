# Welcome to the Taly Team!

Welcome aboard! This document provides an overview of the Taly project, its goals, architecture, and how you can contribute.

## Project Overview

Taly is a comprehensive SaaS platform designed for service-based businesses to streamline operations and enhance customer experience. Unlike generic appointment systems, Taly specializes in high-touch service industries (salons, spas, wellness centers, professional consultants, etc.) with these core capabilities:

*   **Appointment Scheduling:** Advanced booking system with intelligent calendar management, conflict prevention, buffer times, and service-specific duration handling.
*   **Client Management:** Full-featured CRM with customer profiles, visit history, personalized notes, communication logs, and preference tracking.
*   **Payment Processing:** Enterprise-grade payment infrastructure with Stripe Connect and PayPal Business integration, supporting split payments, recurring billing, and installment plans.
*   **Subscription Management:** Tiered subscription model with usage-based billing, feature gates, and automated plan management for optimal business scaling.
*   **Custom Website Builder:** Drag-and-drop website creation with industry-specific templates, online booking widgets, and custom domain support with automatic SSL provisioning.
*   **Reporting & Analytics:** Business intelligence dashboard with customizable KPIs, trend analysis, customer insights, and exportable reports for accounting integration.
*   **Notifications:** Omnichannel communication system with templated messaging, scheduling automation, two-way SMS, and delivery confirmation.

## Architecture

Taly implements a modern microservices architecture with event-driven communication patterns:

*   **Frontend:** 
    - Next.js 14 React applications with TypeScript
    - Component libraries: shadcn/ui with Tailwind CSS
    - State management: TanStack Query for server state, Zustand for client state
    - Authentication: Auth.js with JWT and refresh token rotation
    - Analytics: Posthog for user behavior tracking

*   **Backend:** 
    - NestJS microservices with domain-driven design principles
    - API protocols: REST for CRUD operations, GraphQL for complex data fetching
    - Validation: Zod schema validation with custom business rules
    - Rate limiting: Redis-based request throttling with tiered limits by subscription

*   **Database:** 
    - PostgreSQL 16 with multi-tenant isolation strategy
    - Connection pooling via PgBouncer for efficient resource utilization
    - Read replicas for analytics and reporting workloads
    - Redis for distributed locking, caching, and session management

*   **Serverless Functions:** 
    - AWS Lambda for asynchronous processing:
      - PDF generation (invoices, reports)
      - Image processing and optimization
      - Webhook handling for third-party integrations
      - Scheduled tasks (reminders, analytics)

*   **Message Broker:**  
    - RabbitMQ for reliable message delivery between services
    - Implements both publish-subscribe and request-reply patterns
    - Dead-letter queues with automated retry policies
    - Event schema versioning for backward compatibility

*   **Containerization:** 
    - Docker with multi-stage builds for optimized images
    - Environment-specific configurations via Docker Compose
    - Container health checks and graceful shutdown handling

*   **Orchestration:**  
    - AWS EKS (Elastic Kubernetes Service) for production
    - Horizontal pod autoscaling based on CPU/memory metrics
    - Service mesh with Istio for observability and traffic control
    - AWS App Runner for development and staging environments

*   **Infrastructure as Code:** 
    - Terraform modules with environment separation
    - CI/CD pipeline integration for infrastructure testing
    - State management via S3 with DynamoDB locking

*   **CI/CD:** 
    - GitHub Actions with environment-specific workflows
    - Automated testing: unit, integration, E2E (Playwright)
    - Security scanning: Snyk for dependencies, SonarQube for code quality
    - Deployment strategies: Blue/green for frontend, rolling updates for backend

## Getting Started

1.  **Read the Documentation:**  Familiarize yourself with the project structure, architecture, and coding guidelines in the `docs/` directory.
2.  **Set up your Local Environment:** Follow the instructions in `docs/onboarding/setup-local-environment.md`.
3.  **Explore the Codebase:** Start with the `backend/` and `apps/` directories to understand the core services and frontends.
4.  **Contribute:** Check the project's issue tracker for tasks or pick a small feature to implement.
5.  **Ask Questions:**  Don't hesitate to reach out to the team if you need help!

## Key Concepts

*   **Monorepo:**  Taly uses a monorepo structure, meaning all code (backend, frontend, serverless) is in a single repository. This simplifies dependency management and code sharing.
*   **Microservices:**  The backend is divided into independent services, each responsible for a specific domain.
*   **Event-Driven Architecture:**  Microservices communicate asynchronously using an event bus (RabbitMQ).
*   **Serverless Functions:**  Small, independent functions deployed to AWS Lambda.
*   **GraphQL & REST:**  The backend uses both GraphQL and REST APIs.

---

## Next Steps

*   Review the [Local Development Setup](setup-local-environment.md) guide.
*   Familiarize yourself with the [Tools](tools.md) used in the project.
*   Get to know your [Team Contacts](team-contacts.md).
*   Start exploring the codebase!

Welcome to the team!