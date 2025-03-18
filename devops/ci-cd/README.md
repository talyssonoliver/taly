# CI/CD Pipelines for Taly

This directory contains the CI/CD pipelines for the Taly project, managed using GitHub Actions.

## Pipelines

### 1. Backend CI/CD

- **File**: `backend-pipeline.yml`
- **Trigger**: Pushes and pull requests to `main` branch, affecting `backend/**` files.
- **Steps**:
    - Checks out the code.
    - Sets up Node.js environment with caching.
    - Installs dependencies using `pnpm`.
    - Runs linters and tests.
    - Builds the backend application.
    - Check test coverage with Cobertura.
    - Deploys the backend to AWS (placeholder step).
    - Sends success/failure notifications (example provided).
- **Secrets Required**:
    - `AWS_ACCESS_KEY_ID`
    - `AWS_SECRET_ACCESS_KEY`
    - `AWS_REGION`
    - `SLACK_WEBHOOK_URL` (optional, for Slack notifications)
- **Notes**:
    - Ensure backend `package.json` has `lint`, `test`, and `build` scripts.
    - Replace placeholder deployment steps with your actual deployment logic.

### 2. Database Migration

- **File**: `database-pipeline.yml`
- **Trigger**: Pushes to `main` branch affecting `backend/**/prisma/schema.prisma`. Also allows manual triggering.
- **Steps**:
    - Checks out the code.
    - Sets up Node.js environment.
    - Installs dependencies.
    - Runs Prisma migrations.
    - Sends success/failure notifications (example provided).
- **Secrets Required**:
    - `AWS_ACCESS_KEY_ID`
    - `AWS_SECRET_ACCESS_KEY`
    - `AWS_REGION`
    - `DATABASE_URL`
- **Notes**:
    - This pipeline runs migrations when the Prisma schema changes.
    - Ensure your `DATABASE_URL` secret points to the correct database.

### 3. Frontend CI/CD

- **File**: `frontend-pipeline.yml`
- **Trigger**: Pushes and pull requests to `main` branch, affecting `apps/dashboard/**` or `apps/booking/**` or `apps/payments/**` or `apps/shared-ui/**` files.
- **Steps**:
    - Checks out the code.
    - Sets up Node.js environment with caching.
    - Installs dependencies.
    - Runs linters and tests for the affected frontend application.
    - Builds the frontend application.
    - Placeholder for deployment steps.
- **Secrets Required**:
    -  None at the moment; might be needed for deployment credentials.
- **Notes**:
    - Uses a matrix strategy to run the same steps for multiple frontend apps.
    - Assumes `lint`, `test`, and `build` scripts are defined in each app's `package.json`.
    - Deployment steps need to be implemented.

### 4. Nightly Build

- **File**: `nightly-build.yml`
- **Trigger**: Scheduled to run daily at 00:00 UTC.
- **Steps**:
    - Checks out the code.
    - Sets up Node.js environment.
    - Installs dependencies.
    - Runs linters for all projects.
    - Runs tests for all projects.
    - Builds the backend and frontend applications.
    - Sends success/failure notifications (example provided).
- **Notes**:
    - Provides a comprehensive daily check of the entire codebase.
    - Useful for catching integration issues and running more extensive tests.

### 5. Serverless CI/CD

- **File**: `serverless-pipeline.yml`
- **Trigger**: Pushes and pull requests to `main` branch, affecting `serverless/**` files.
- **Steps**:
    - Checks out the code.
    - Sets up Node.js.
    - Installs the Serverless Framework.
    - Installs dependencies.
    - Deploys serverless functions using `serverless deploy`.
    - Sends success/failure notifications (example provided).
- **Secrets Required**:
    - `AWS_ACCESS_KEY_ID`
    - `AWS_SECRET_ACCESS_KEY`
    - `AWS_REGION`
- **Notes**:
    - Assumes you are using the Serverless Framework for managing your serverless functions.
    - The `--stage prod` argument should be changed based on your environment strategy (e.g., using GitHub Actions environments).

## General Guidelines

- **Environment Variables**: Use GitHub Secrets to store sensitive information like API keys and credentials.
- **Notifications**: Customize notifications to use your preferred communication channels (e.g., Slack, email).
- **Testing**: Ensure your tests are comprehensive and cover critical functionality.
- **Deployment**: Implement appropriate deployment strategies for your chosen platforms (e.g., Kubernetes, AWS Lambda, AWS S3).

This documentation provides a high-level overview of the CI/CD pipelines. Refer to the individual `.yml` files for the detailed implementation of each pipeline.