# Environment Variables Documentation for Taly CRM

This document outlines all environment variables used in the Taly CRM project, including their purpose, which services use them, and example values.

---

## General

- **NODE_ENV**

  - **Description:** Defines the environment mode (development, production, testing).
  - **Example:** `NODE_ENV=development`

- **APP_PORT**

  - **Description:** The port on which the application runs.
  - **Example:** `APP_PORT=4000`

- **JWT_SECRET**

  - **Description:** Secret key used for signing and verifying JWT tokens.
  - **Example:** `JWT_SECRET=supersecretkey123`
  - **Security Tip:** Use a strong, random string and store it securely in production environments (e.g., AWS Secrets Manager).

- **JWT_EXPIRATION_TIME**
  - **Description:** Defines the JWT token expiration time (in seconds).
  - **Example:** `JWT_EXPIRATION_TIME=86400` # 24 hours

---

## Database

- **DATABASE_URL**

  - **Description:** Connection string for the PostgreSQL database.
  - **Example:** `DATABASE_URL=postgresql://postgres:password@localhost:5432/Taly`

- **DATABASE_DIRECT_URL**
  - **Description:** Direct URL for Prisma database connection (if required).
  - **Example:** `DATABASE_DIRECT_URL=postgresql://postgres:password@localhost:5432/Taly`

---

## Authentication (Google Auth)

- **GOOGLE_CLIENT_ID**

  - **Description:** Google OAuth Client ID for authentication.
  - **Example:** `GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com`

- **GOOGLE_CLIENT_SECRET**
  - **Description:** Google OAuth Client Secret.
  - **Example:** `GOOGLE_CLIENT_SECRET=your-google-client-secret`

---

## NextAuth (Frontend Authentication)

- **NEXTAUTH_SECRET**

  - **Description:** Secret key for encrypting NextAuth tokens and cookies.
  - **Example:** `NEXTAUTH_SECRET=your-nextauth-secret`

- **NEXTAUTH_URL**
  - **Description:** Base URL of the frontend application for authentication callbacks.
  - **Example:** `NEXTAUTH_URL=http://localhost:3000`

---

## Frontend

- **API_BASE_URL**
  - **Description:** The base URL used by frontend applications to interact with the backend API.
  - **Example:** `API_BASE_URL=http://localhost:4000`

---

## Additional Services (If applicable)

- **RABBITMQ_URL**

  - **Description:** Connection URL for RabbitMQ (if message broker is used).
  - **Example:** `RABBITMQ_URL=amqp://user:password@rabbitmq:5672`

- **STRIPE_SECRET_KEY**

  - **Description:** Secret key for Stripe payment processing.
  - **Example:** `STRIPE_SECRET_KEY=sk_test_...`

- **MAIL_SERVICE_API_KEY**
  - **Description:** API key for email services (e.g., Twilio SendGrid).
  - **Example:** `MAIL_SERVICE_API_KEY=your-email-service-api-key`

---

## Security and Best Practices

- **Avoid hardcoding sensitive data** directly in source code or Docker Compose files.
- **Use environment variable management tools** in production (e.g., AWS Secrets Manager, HashiCorp Vault).
- **Regularly rotate secrets** and **apply least privilege principles** for access management.

---
