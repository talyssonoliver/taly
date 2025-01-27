# Taly - Salon Management SaaS Platform

## Overview
Taly is an all-in-one Software-as-a-Service (SaaS) platform designed for salon owners to streamline their business operations, manage appointments, handle payments, and gain insights through advanced analytics. Built with scalability, flexibility, and user-centric design at its core, Taly empowers salon owners to enhance customer satisfaction while optimizing operational efficiency.

---

## Key Features

### **1. Appointment Scheduling**
- User-friendly booking system with calendar integration.
- Automated reminders via SMS and email to reduce no-shows.
- Role-based access for staff to manage schedules efficiently.

### **2. Payment Processing**
- Secure and seamless payment integration via Stripe and PayPal.
- Automatic fee calculation based on subscription plans.
- Detailed transaction history and refund support.

### **3. Subscription Plans**
- **Free Plan**: Basic features with limited bookings.
- **Pro Plan**: Advanced features with increased booking limits and dashboard access.
- **Premium Plan**: Unlimited bookings, custom analytics, and priority support.

### **4. Custom Website**
- Personalized website for salons to showcase services.
- Integrated booking functionality with domain customization (Pro & Premium plans).

### **5. Advanced Dashboard**
- Real-time metrics on bookings, payments, and customer interactions.
- Exportable reports in PDF/Excel formats.
- Interactive charts and graphs powered by modern data visualization tools.

### **6. Notifications**
- Multi-channel notifications for booking confirmations, reminders, and payment receipts.
- Integration with Twilio (SMS) and Amazon SES (email).

---

## Technology Stack

### **Frontend**
- **Framework**: Next.js (React.js) with server-side rendering (SSR).
- **UI**: Tailwind CSS and Material-UI for responsive design.
- **State Management**: Redux Toolkit and React Query.

### **Backend**
- **Framework**: NestJS (Node.js).
- **Database**: PostgreSQL for relational data, Redis for caching.
- **Authentication**: OAuth 2.0 and JWT.

### **DevOps**
- **Orchestration**: Kubernetes for containerized microservices.
- **CI/CD**: GitHub Actions for automated pipelines.
- **Hosting**: AWS (EKS for backend, S3/CloudFront for frontend).

---

## Project Structure
```
C:\taly\dir-taly\taly
├── apps/
│   ├── dashboard/         # Admin panel for salon owners
│   ├── booking/           # Public booking interface
│   ├── payments/          # Payment management module
│   └── shared-ui/         # Reusable components
├── backend/
│   ├── auth-service/      # Authentication and authorization
│   ├── user-service/      # User and salon profile management
│   ├── booking-service/   # Appointment scheduling
│   ├── payment-service/   # Payment processing
│   └── notification-service/ # Notifications (SMS/Email)
├── serverless/            # Serverless functions (e.g., email templates, reports)
├── shared/                # Common utilities and libraries
├── devops/                # CI/CD, infrastructure as code, monitoring
├── docs/                  # Documentation and architecture diagrams
└── README.md              # Project overview
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
- **Email**: support@taly.com
- **GitHub**: [https://github.com/talyssonoliver/taly](https://github.com/talyssonoliver/taly)
- **Slack**: Join our [community workspace](https://slack.taly.com)!