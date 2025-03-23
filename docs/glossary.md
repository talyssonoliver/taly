# Taly Project Glossary

## Overview

This glossary defines key terms, concepts, and acronyms used throughout the Taly platform. It serves as a reference for developers, stakeholders, and team members to ensure consistent understanding and communication across the project.

---

## Terms and Definitions

### **A**

- **API (Application Programming Interface)**: A set of rules and protocols for building and interacting with software applications. In Taly, APIs are used for communication between microservices and frontend apps.
- **Authentication**: The process of verifying the identity of a user. Implemented via OAuth 2.0 and JWT in the Taly platform.
- **Authorization**: The process of determining what actions a user is allowed to perform based on their role or permissions.

### **B**

- **Booking**: Represents an appointment made by a customer with a company. Managed by the `booking-service`.
- **Backend**: The server-side of the application responsible for processing logic, database interactions, and API management.

### **C**

- **CI/CD (Continuous Integration and Continuous Deployment)**: A set of practices for automating code testing, integration, and deployment. Used in Taly to ensure rapid and reliable delivery of new features.
- **Cache**: Temporary storage of data for faster access. Taly uses Redis for caching frequently accessed data.

### **D**

- **Database Migration**: The process of updating database schema incrementally. Taly uses Prisma for schema management and migrations.
- **DevOps**: A set of practices that combines software development and IT operations to shorten development cycles and improve delivery.
- **Docker**: A platform for containerizing applications. Used in Taly to package microservices for consistent deployment.

### **E**

- **EKS (Elastic Kubernetes Service)**: Amazon’s managed Kubernetes service, used to orchestrate containers in the Taly platform.
- **Environment**: A setup where an application is run, such as development, staging, or production.

### **F**

- **Frontend**: The client-side of the application responsible for rendering user interfaces and interacting with backend APIs.

### **I**

- **Infrastructure as Code (IaC)**: Managing infrastructure using code instead of manual processes. Taly employs Terraform for IaC.

### **J**

- **JWT (JSON Web Token)**: A compact token format used for securely transmitting information between parties. Used for authentication in Taly.

### **K**

- **Kubernetes (K8s)**: An open-source platform for automating deployment, scaling, and management of containerized applications. Core to Taly's microservices architecture.

### **L**

- **Load Balancer**: Distributes incoming network traffic across multiple servers to ensure high availability and reliability.

### **M**

- **Microservices**: An architectural style where the application is divided into smaller, independent services. Taly implements microservices for auth, user, booking, payments, and notifications.
- **Monitoring**: The practice of tracking application performance and health. Tools like Prometheus and Grafana are used in Taly for monitoring.

### **N**

- **Node.js**: A JavaScript runtime used for server-side development. Core to Taly’s backend services.
- **Notification**: Messages sent to users (e.g., via email or SMS) to inform them of updates, confirmations, or alerts.

### **O**

- **OAuth 2.0**: An authorization framework that allows third-party services to access user resources. Used for social login in Taly.

### **P**

- **Plan**: Subscription tiers (Free, Pro, Premium) offered to company owners on the Taly platform.
- **PostgreSQL**: The relational database system used by Taly for persistent data storage.
- **Prometheus**: A monitoring tool for collecting and querying metrics. Integrated into Taly’s infrastructure.

### **R**

- **Redis**: An in-memory data structure store used for caching and session management in Taly.
- **Role-Based Access Control (RBAC)**: A method of restricting system access based on user roles.

### **S**

- **Scaling**: The systematic process of increasing or decreasing computational resources to match application demand. Taly implements both horizontal scaling (adding more service instances) and vertical scaling (increasing resources per instance) managed through Kubernetes HPA (Horizontal Pod Autoscaler).

- **Serverless**: A cloud execution model where infrastructure management is abstracted away from developers. Taly uses AWS Lambda for event-driven, stateless functions that handle specific workloads like notification delivery, report generation, and image processing, with automatic scaling from zero to peak demand.

- **Service Mesh**: An infrastructure layer that manages service-to-service communication in the Taly platform, implemented with Istio to provide traffic management, security policies, and observability across microservices.

- **Stripe Connect**: The payment processing platform integrated into Taly for marketplace-style payment distribution, allowing business owners to accept payments while Taly handles platform fees with automated reconciliation.

### **T**

- **Terraform**: An infrastructure-as-code tool used in Taly for declaratively defining and provisioning cloud resources across AWS, with modular architecture for reusable components, environment separation, and automated testing.

- **Tailwind CSS**: A utility-first CSS framework used throughout Taly's frontend applications for consistent design implementation, with custom theme configuration aligned to our design system specifications.

- **TanStack Query**: A data fetching and cache management library (formerly React Query) used in Taly's frontend to handle server state, with automatic background refetching, optimistic updates, and error handling policies.

- **Twilio**: A communication API platform integrated with Taly's notification service for programmable SMS, voice, and WhatsApp messaging, with delivery confirmation and two-way communication capabilities.

### **U**

- **UI (User Interface)**: The visual and interactive components of Taly that users engage with, built using React components with responsive design principles, accessibility compliance (WCAG 2.1 AA), and performance optimization for various devices.

- **User Session**: A period of user interaction with Taly, tracked via JWT tokens with configurable expiration policies, refresh token rotation for extended sessions, and secure storage practices to prevent token theft.

- **UUID (Universally Unique Identifier)**: A 128-bit identifier used in Taly's database schema for entity identification instead of sequential IDs, providing improved security and eliminating collision risks in distributed systems.

### **V**

- **Virtual Machine (VM)**: A software-based emulation of a physical computer. Taly uses AWS EC2 instances for specific workloads requiring persistent compute resources such as the RabbitMQ message broker and database instances.

- **Versioning**: The practice of tracking changes to APIs, database schemas, and events over time. Taly implements semantic versioning (SemVer) for all services with backward compatibility guarantees and documented migration paths.

- **Vault**: HashiCorp's secret management tool used in the Taly infrastructure to securely store and access sensitive information such as API keys, database credentials, and encryption keys with strict access controls and audit logging.

- **Vercel**: A cloud platform used for deploying Taly's frontend applications with features like preview deployments for pull requests, edge caching, and seamless integration with our GitHub workflows.

---

## Contributing to the Glossary

If you’d like to add or update terms:

1. Create a branch for your changes:
   ```bash
   git checkout -b docs/update-glossary
   ```
2. Edit `glossary.md` and commit your changes.
3. Submit a pull request with a detailed description of your additions or updates.

---

## Contact

For questions or suggestions about the glossary:

- **Email**: docs-support@taly.dev
- **GitHub**: [https://github.com/talyssonoliver/taly](https://github.com/talyssonoliver/taly)
