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
- **Booking**: Represents an appointment made by a customer with a salon. Managed by the `booking-service`.
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
- **Plan**: Subscription tiers (Free, Pro, Premium) offered to salon owners on the Taly platform.
- **PostgreSQL**: The relational database system used by Taly for persistent data storage.
- **Prometheus**: A monitoring tool for collecting and querying metrics. Integrated into Taly’s infrastructure.

### **R**
- **Redis**: An in-memory data structure store used for caching and session management in Taly.
- **Role-Based Access Control (RBAC)**: A method of restricting system access based on user roles.

### **S**
- **Scaling**: The process of adjusting resources (e.g., servers) to meet demand. Taly uses Kubernetes for scaling services.
- **Serverless**: A cloud computing model where applications run in stateless containers. Taly employs serverless functions for specific tasks, like email notifications.
- **Stripe**: A payment processing platform integrated into Taly for secure transactions.

### **T**
- **Terraform**: A tool for defining and provisioning infrastructure as code. Used in Taly to manage cloud resources.
- **Twilio**: A communications platform used in Taly for sending SMS notifications.

### **U**
- **UI (User Interface)**: The visual elements of an application that users interact with. Built with Next.js and React in Taly.

### **V**
- **Virtual Machine (VM)**: A software-based simulation of a physical computer. Used in Taly’s staging and production environments for running services.

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
