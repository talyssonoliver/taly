# Taly Backend Services

## Overview
The `backend/` directory contains the core microservices that power the Taly platform. Each service is built to handle specific business domains, ensuring separation of concerns, scalability, and maintainability. The backend is implemented using **NestJS** with PostgreSQL as the primary database and follows a microservice architecture to deliver robust functionality across the platform.

---

## Directory Structure
```
C:\taly\dir-taly\taly\backend
├── auth-service/          # Handles authentication and authorization
├── user-service/          # Manages users, salons, and plans
├── booking-service/       # Handles appointment scheduling
├── payment-service/       # Manages payments and transactions
├── notification-service/  # Sends notifications (email/SMS)
├── message-broker/        # Event-driven architecture (e.g., RabbitMQ)
```

---

## Microservices

### **1. Auth Service**
- **Purpose**: Manages user authentication, roles, and permissions.
- **Key Features**:
  - Login via email/password or social providers (Google, Facebook).
  - Token-based authentication (JWT) with refresh token support.
  - Role-based access control (RBAC).
- **Tech Stack**:
  - NestJS, Prisma (PostgreSQL).
  - Passport.js for OAuth strategies.

### **2. User Service**
- **Purpose**: Manages user profiles, salon details, and subscription plans.
- **Key Features**:
  - CRUD operations for users and salons.
  - Subscription plan management.
  - Role differentiation (e.g., owner, staff, customer).
- **Tech Stack**:
  - NestJS, Prisma (PostgreSQL).

### **3. Booking Service**
- **Purpose**: Handles appointment scheduling and availability.
- **Key Features**:
  - Booking creation, updates, and cancellations.
  - Calendar-based availability management.
  - Integration with user and salon services.
- **Tech Stack**:
  - NestJS, Prisma (PostgreSQL).

### **4. Payment Service**
- **Purpose**: Processes payments and manages transaction data.
- **Key Features**:
  - Integration with Stripe and PayPal.
  - Fee calculation based on subscription plans.
  - Refund processing and transaction history.
- **Tech Stack**:
  - NestJS, Prisma (PostgreSQL).

### **5. Notification Service**
- **Purpose**: Sends email and SMS notifications for various events.
- **Key Features**:
  - Notifications for booking confirmations, reminders, and payment receipts.
  - Multi-channel integration (Twilio for SMS, Amazon SES for email).
  - Template-based notifications.
- **Tech Stack**:
  - NestJS, RabbitMQ (message queue).

### **6. Message Broker**
- **Purpose**: Facilitates event-driven communication between microservices.
- **Key Features**:
  - Publishes and consumes domain-specific events (e.g., `booking-created`, `payment-processed`).
  - Ensures decoupled communication across services.
- **Tech Stack**:
  - RabbitMQ for message brokering.

---

## How to Run the Backend Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/talyssonoliver/taly.git
   cd taly/backend
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in each service directory (e.g., `auth-service/.env`).
   - Example configuration for `auth-service`:
     ```env
     DATABASE_URL=postgresql://user:password@localhost:5432/auth
     JWT_SECRET=your_jwt_secret
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     ```

4. **Run Services Locally**:
   ```bash
   pnpm run start:dev
   ```

5. **Start All Services Using Docker Compose**:
   ```bash
   docker-compose up
   ```

---

## Deployment

1. **CI/CD Pipelines**:
   - Configured via GitHub Actions for automated testing and deployment.
   - Merging into the `main` branch triggers deployment pipelines.

2. **Production Environment**:
   - Hosted on AWS using Kubernetes (EKS).
   - PostgreSQL managed via Amazon RDS.
   - Message brokering with RabbitMQ.

---

## Testing

1. **Run Unit Tests**:
   ```bash
   pnpm run test
   ```

2. **Run Integration Tests**:
   ```bash
   pnpm run test:integration
   ```

3. **Run E2E Tests**:
   ```bash
   pnpm run test:e2e
   ```

---

## Event-Driven Architecture

Taly’s backend relies heavily on event-driven patterns to ensure seamless communication between microservices. Example events:

- **Booking Events**:
  - `booking-created`: Triggered when a new booking is made.
  - `booking-updated`: Triggered when a booking is modified or canceled.

- **Payment Events**:
  - `payment-processed`: Triggered after successful payment.
  - `payment-refunded`: Triggered when a refund is issued.

- **Notification Events**:
  - `notification-sent`: Triggered after a notification is successfully delivered.

---

## Contact

For any backend-related questions or issues:
- **Email**: backend-support@taly.com
- **GitHub**: [https://github.com/talyssonoliver/taly](https://github.com/talyssonoliver/taly)
