# Taly - Company Management SaaS Platform

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [Appointment Scheduling](#1-appointment-scheduling)
  - [Payment Processing](#2-payment-processing)
  - [Subscription Plans](#3-subscription-plans)
  - [Custom Website](#4-custom-website)
  - [Advanced Dashboard](#5-advanced-dashboard)
  - [Notifications](#6-notifications)
- [Technology Stack](#technology-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [DevOps](#devops)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Deployment](#deployment)
- [License](#license)
- [Contact](#contact)

## Overview

Taly is an all-in-one Software-as-a-Service (SaaS) platform designed specifically for service-based businesses (salons, spas, consultants, etc.) to streamline their operations. It enables business owners to efficiently manage appointments, process payments, and gain actionable insights through comprehensive analytics. Built with scalability, flexibility, and user-centric design principles, Taly empowers businesses to enhance customer satisfaction while optimizing their operational efficiency.

---

## Key Features

### **1. Appointment Scheduling**

- Intuitive booking interface with seamless calendar integration (Google Calendar, iCal, Outlook)
- Smart automated reminders via SMS and email with configurable timing to minimize no-shows
- Role-based staff access with customizable permissions for schedule management

### **2. Payment Processing**

- PCI-compliant payment integration via Stripe, PayPal, and Square
- Smart fee calculation based on subscription plans with transparent pricing
- Comprehensive transaction history with one-click refund capabilities and automated receipts

### **3. Subscription Plans**

- **Free Plan**: Essential features with up to 30 monthly bookings and basic reporting
- **Pro Plan ($29/month)**: Enhanced features with up to 500 monthly bookings and advanced analytics
- **Premium Plan ($79/month)**: Unlimited bookings, custom analytics dashboard, priority support, and white-labeling

### **4. Custom Website**

- Drag-and-drop website builder with industry-specific templates
- SEO-optimized booking pages with conversion-focused design
- Custom domain integration with SSL certification (Pro & Premium plans)

### **5. Advanced Dashboard**

- Real-time business metrics with customizable KPI tracking
- Exportable reports in multiple formats with scheduled delivery options
- Interactive data visualization with trend analysis and forecasting tools

### **6. Notifications**

- Omnichannel communication system with appointment confirmations, reminders, and follow-ups
- Enterprise-grade integration with Twilio (SMS/Voice), Amazon SES (email), and Firebase (push notifications)
- Customizable notification templates with dynamic content insertion

---

## Technology Stack

### **Frontend**

- **Framework**: Next.js 14 with App Router for optimized rendering
- **UI**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: TanStack Query (React Query) and Zustand for efficient state handling

### **Backend**

- **Framework**: NestJS 10 with modular architecture
- **Database**: PostgreSQL 16 with TimescaleDB for time-series data, Redis for caching
- **Authentication**: Auth.js with JWT tokens and multi-factor authentication support

### **DevOps**

- **Orchestration**: Kubernetes with Helm charts for service management
- **CI/CD**: GitHub Actions with comprehensive testing pipelines
- **Hosting**: AWS EKS for containerized backend, Vercel for frontend applications

---

## Project Structure

```
\taly
├── apps/
│ ├── dashboard/ # Admin panel (Next.js)
│ ├── booking/ # Public booking interface (Next.js) - Very basic for MVP
│ ├── payments/ # Payment management (Next.js) - May be integrated into dashboard for MVP
│ └── shared-ui/ # Reusable UI components
├── api/ # Backend (NestJS - Monolith)
│ ├── src/
│ │ ├── appointments/ # Appointment logic
│ │ ├── auth/ # Authentication
│ │ ├── clients/ # Client management (simplified for MVP)
│ │ ├── config/ # Configuration files
│ │ ├── database/ # Prisma setup
│ │ ├── mail/ # Email sending
│ │ ├── notifications/ # SMS/Email notifications (simplified for MVP)
│ │ ├── payments/ # Payment processing (basic)
│ │ ├── companies/ # Managin Company data
│ │ ├── subscriptions/ # Subscription management (simplified for MVP)
│ │ ├── users/ # User management
│ │ └── websites/ # Website builder (deferred)
├── serverless/ # Serverless functions (e.g., email sending)
├── shared/ # Common utilities, DTOs, types, etc.
├── devops/ # CI/CD, infrastructure-as-code
├── docs/ # Documentation
└── README.md # This file
```

---

## How to Contribute

We welcome contributions to Taly! Here's how you can get started:

1. **Fork the Repository**: Create your own fork of the project.
2. **Clone the Repo**: Clone the repository to your local machine.
   ```bash
   git clone https://github.com/your-username/taly.git
   ```
3. **Set Up Your Environment**:
   - Install dependencies: `pnpm install`
   - Run services locally: `docker-compose up`
4. **Make Your Changes**: Implement your feature or fix.
5. **Submit a Pull Request**: Push your changes and open a PR with a detailed description.

---

## Deployment

1. **Prerequisites**:

   - Docker and Docker Compose installed.
   - Access to AWS credentials for infrastructure setup.

2. **Run Locally**:

   ```bash
   pnpm run dev
   ```

3. **Deploy to Production**:
   - CI/CD pipelines are configured via GitHub Actions.
   - Merge changes into the `main` branch to trigger deployment.

---

## License

Taly is licensed under the MIT License. See `LICENSE.md` for more details.

---

## Contact

For questions or support, contact the development team:

- **Email**: support@taly.dev
- **GitHub**: [https://github.com/talyssonoliver/taly](https://github.com/talyssonoliver/taly)
- **Slack**: Join our [community workspace](https://slack.taly.dev)!
