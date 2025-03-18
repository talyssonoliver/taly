# Development Tools for Taly

This document lists the essential tools and technologies used in the Taly project, along with setup instructions and links to relevant resources.

## Core Tools

### **1. Node.js (v20+)**

- **Purpose:** JavaScript runtime environment for backend services and frontend build tools.
- **Installation:**
    - Download from [https://nodejs.org/](https://nodejs.org/) (LTS version recommended).
    - Verify installation: `node -v` (should show v20.x.x or higher)
    - Consider using a Node.js version manager like `nvm` or `fnm` to easily switch between Node.js versions.  This is *highly* recommended:
        - **nvm (Node Version Manager):** [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)
        - **fnm (Fast Node Manager):** [https://github.com/Schniz/fnm](https://github.com/Schniz/fnm)
        - After installing either, you should typically run `nvm install --lts` or `fnm install --lts` and then `nvm use --lts` or `fnm use --lts` in your project.

### **2. pnpm (v8+)**

- **Purpose:**  Package manager for JavaScript (faster and more efficient than npm).
- **Installation:**
  ```bash
  npm install -g pnpm
Verify installation: pnpm -v (should show 8.x.x or higher)

3. Docker & Docker Compose
Purpose: Containerization of services (backend, database, etc.) for consistent development and deployment.

Installation:

Docker Desktop: Recommended for Windows and macOS. Download from https://www.docker.com/products/docker-desktop.

Docker Engine & Docker Compose (Linux): Follow instructions for your distribution from https://docs.docker.com/engine/install/.

Verification:

docker --version

docker-compose --version (or docker compose version if using Compose v2)

4. AWS CLI
Purpose: Interacting with AWS services (ECR, App Runner, Lambda, etc.).

Installation:

Follow the official instructions: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

Configuration:

Configure your AWS credentials using aws configure. You'll need your Access Key ID and Secret Access Key.

Set your default region (e.g., us-east-1).

5. Serverless Framework
Purpose: Deploying and managing serverless functions.

Installation:
    npm install -g serverless
Verify installation: serverless --version

6. Prisma CLI
Purpose: Managing the database schema and migrations.

Installation:
    npm install -g prisma
Verify installation: prisma --version

7. NestJS CLI
Purpose: Used in the backend services

Installation:
    npm install -g @nestjs/cli
Verify installation: npx --version

8. PostgreSQL Client
Purpose: Interacting with the PostgreSQL database.

Options:

psql: Command-line client (usually installed with PostgreSQL).

pgAdmin: GUI client (download from https://www.pgadmin.org/).

DBeaver: Cross-platform database tool (https://dbeaver.io/).

9. Code Editor (VS Code Recommended)
Purpose: Development and debugging.

Recommendation: Visual Studio Code (VS Code) is the preferred editor for its excellent TypeScript support and extensions.

Extensions:

ESLint: For code linting and style consistency.

Prettier: For code formatting.

Docker: For working with Docker containers and images.

Remote - Containers (optional): For developing inside a Docker container.

Prisma for syntax highlighting and intellisense

NestJS Snippets

Tailwind CSS Intellisense

Handlebars

EditorConfig for VS Code

10. Git
Purpose: Version control.

Installation:

Git comes pre-installed on most macOS and Linux systems.

Windows: Download from https://git-scm.com/.

Verification: git --version

Optional Tools
GitHub Desktop: GUI client for Git (useful for beginners).

Postman or Insomnia: API testing tools (alternative to curl).

AWS Toolkit for VS Code: For interacting with AWS services directly from VS Code.

Kubernetes extension for VS Code: For managing Kubernetes resources.

Project-Specific Tools (Installed as Dependencies)
These tools are installed as part of the project's dependencies and don't require separate global installation:

TypeScript: Superset of JavaScript that adds static typing.

React & Next.js: Frontend frameworks.

NestJS: Backend framework.

Prisma: Database ORM.

Jest: Testing framework.

Tailwind CSS: Utility-first CSS framework.

Handlebars: Templating engine

These are managed by pnpm and will be installed when you run pnpm install.