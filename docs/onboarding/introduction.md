# Welcome to the Taly Team!

Welcome aboard! This document provides an overview of the Taly project, its goals, architecture, and how you can contribute.

## Project Overview

Taly is a SaaS platform designed for company owners, primarily in the service industry (like salons, spas, etc.), to manage their businesses more efficiently.  It provides features for:

*   **Appointment Scheduling:**  A user-friendly booking system with calendar integration.
*   **Client Management:**  A CRM to store client information, track appointments, and manage notes.
*   **Payment Processing:**  Secure and seamless payment integration (Stripe and PayPal).
*   **Subscription Management:**  Different subscription tiers (Free, Pro, Premium) for company owners.
*   **Custom Website Builder:**  (Future Enhancement)  Allows companies to create a basic online presence.
*   **Reporting & Analytics:**  Provides insights into bookings, revenue, and client activity.
*   **Notifications:**  Automated email and SMS notifications for appointments and payments.

## Architecture

Taly is built with a microservices architecture, using the following technologies:

*   **Frontend:** Next.js (React) for the user interfaces (dashboard, booking app, payment portal, shared UI components).
*   **Backend:** NestJS (Node.js) for the API services (authentication, booking, payment, notification, etc.).
*   **Database:** PostgreSQL (for relational data) and Redis (for caching).
*   **Serverless Functions:** AWS Lambda for specific tasks like sending emails and generating reports.
*   **Message Broker:**  RabbitMQ for asynchronous communication between services (event-driven architecture).
*   **Containerization:** Docker for packaging services and applications.
*   **Orchestration:**  Kubernetes (EKS) is planned for future scaling (currently using AWS App Runner for simplicity).
*   **Infrastructure as Code (IaC):** Terraform for managing cloud resources.
*   **CI/CD:** GitHub Actions for automated builds, tests, and deployments.

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