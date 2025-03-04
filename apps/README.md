# Taly Apps - Microfrontend Architecture

## Overview

The `apps/` directory contains the core microfrontends of the Taly platform. Each app serves a distinct purpose, tailored to the roles and needs of the system's users. This microfrontend approach ensures modularity, scalability, and streamlined development workflows.

---

## Directory Structure

```
C:\taly\dir-taly\taly\apps
├── dashboard/         # Admin panel for company owners
│   ├── src/
│   │   ├── components/   # Reusable dashboard components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API services for dashboard
│   │   ├── pages/        # Dashboard pages
│   │   └── styles/       # Styles and themes
├── booking/           # Public booking interface for customers
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── pages/
│   │   └── styles/
├── payments/          # Payment management module
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── pages/
│   │   └── styles/
├── shared-ui/          # Reusable UI components, hooks, and utilities
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── styles/
│   │   └── index.ts

```

### **1. Dashboard**

- **Purpose**: Provides company owners with tools to manage their businesses, including bookings, payments, and analytics.
- **Key Features**:
  - Metrics overview (appointments, revenue, customer interactions).
  - Configurable settings for companies (e.g., staff permissions, service offerings).
  - Reports with exportable insights.
- **Tech Stack**:
  - Next.js for server-side rendering and SEO.
  - Tailwind CSS for styling.
  - Integrated with backend services (e.g., `user-service`, `payment-service`).

### **2. Booking**

- **Purpose**: A user-friendly public interface for customers to schedule appointments with companies.
- **Key Features**:
  - Interactive calendar for selecting available time slots.
  - Integration with company-specific configurations.
  - Responsive design for mobile and desktop users.
- **Tech Stack**:
  - React.js with Next.js for fast rendering.
  - Axios for API interactions.
  - CSS-in-JS for scalable styles.

### **3. Payments**

- **Purpose**: Handles all payment-related functionalities for company owners and customers.
- **Key Features**:
  - Payment history for company owners.
  - Secure Stripe/PayPal integration for customers.
  - Refund management and transaction tracking.
- **Tech Stack**:
  - React.js with reusable components.
  - Chart.js for visualizing payment data.
  - API integrations with `payment-service` backend.

### **4. Shared-UI**

- **Purpose**: Houses reusable UI components to ensure consistency across all apps.
- **Key Features**:
  - Common components such as buttons, modals, inputs, and navigation bars.
  - Centralized theme and style definitions for uniformity.
  - Optimized for reusability and extensibility.
- **Tech Stack**:
  - Storybook for component documentation.
  - Tailwind CSS for theming.

### 5. Shared Hooks

To simplify API calls and ensure consistency, a shared custom hook `useFetch` is provided in `shared-ui/src/hooks/useFetch.ts`. It handles API requests, manages loading state, and prevents memory leaks.

#### Example usage:

````tsx
import { useFetch } from "@hooks/useFetch";
import { BookingService } from "@services/bookingService";

const { data: bookings, loading, error } = useFetch(BookingService.getAllBookings);


---

## How to Run Each App

1. Navigate to the specific app directory:
   ```bash
   cd apps/dashboard
````

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Access the app in your browser:
   - Dashboard: `http://localhost:3000`
   - Booking: `http://localhost:3001`
   - Payments: `http://localhost:3002`

---

## Contributing to Apps

1. **Create a Feature Branch**:

   ```bash
   git checkout -b feature/app-improvement
   ```

2. **Follow Component Guidelines**:

   - Use shared components from `shared-ui` wherever possible.
   - Ensure components are responsive and accessible.

3. **Write Tests**:

   - Unit tests for React components.
   - Integration tests for API interactions.

4. **Submit a Pull Request**:
   ```bash
   git push origin feature/app-improvement
   ```

---

## Deployment

1. **Build the App**:

   ```bash
   pnpm build
   ```

2. **Deployment Pipelines**:
   - Each app is configured with a CI/CD pipeline via GitHub Actions.
   - Merging into the `main` branch triggers the pipeline to build and deploy to AWS.

---

## Contact

For assistance or to report issues:

- **Email**: dev-support@taly.dev
- **GitHub**: [https://github.com/talyssonoliver/taly](https://github.com/talyssonoliver/taly)
