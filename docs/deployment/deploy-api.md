# Deploying the Taly Backend

This guide outlines the steps to deploy the Taly backend services.  We'll use **AWS App Runner** for initial deployment, focusing on simplicity and cost-effectiveness.

## Prerequisites

-   An AWS account with appropriate permissions (see [Environment Setup](environment-setup.md)).
-   Docker Desktop installed and running.
-   The AWS CLI installed and configured.
-   A GitHub repository with the Taly project code.
-   GitHub Actions configured with necessary secrets (see [Environment Setup](environment-setup.md)).
-   An Amazon ECR (Elastic Container Registry) repository created.  *Name it `taly-backend` or similar.*

## Deployment Steps (Manual - for Initial Setup and Understanding)

These steps are for *manual* deployment, primarily for your initial setup and to understand the process.  For ongoing deployments, use the CI/CD pipeline.

1.  **Build the Docker Image:**

    ```bash
    cd backend
    docker build -t taly-backend .
    ```

2.  **Tag the Image:**

    ```bash
    docker tag taly-backend:latest <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.<YOUR_AWS_REGION>.amazonaws.com/taly-backend:latest
    ```

    Replace `<YOUR_AWS_ACCOUNT_ID>` and `<YOUR_AWS_REGION>` with your actual values.

3.  **Authenticate with ECR:**

    ```bash
    aws ecr get-login-password --region <YOUR_AWS_REGION> | docker login --username AWS --password-stdin <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.<YOUR_AWS_REGION>.amazonaws.com
    ```

4.  **Push the Image to ECR:**

    ```bash
    docker push <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.<YOUR_AWS_REGION>.amazonaws.com/taly-backend:latest
    ```

5.  **Create an App Runner Service:**

    *   Go to the AWS Management Console.
    *   Navigate to App Runner.
    *   Choose "Create service".
    *   Select "Container registry" as the source.
    *   Choose "Amazon ECR" as the registry type.
    *   For "Image URI", enter the full URI of your image (from step 4).
    *   Configure the service:
        *   **Service name:** `taly-backend`
        *   **Deployment trigger:**  Choose "Manual" for initial setup.  Later, you'll configure automatic deployments from the CI/CD pipeline.
        *   **Instance configuration:** Choose a small instance type (e.g., 1 vCPU, 2 GB RAM) for initial testing.  Monitor resource usage and adjust as needed.
        *   **Environment variables:**  Add your environment variables (from `.env`).  *Crucially*, make sure to set `DATABASE_URL` to point to your production database (Amazon RDS).
        *   **Port:** Set the port to `4000` (or whatever port your NestJS backend uses).
        *   **Auto scaling** You can setup automatic scalling based on load.
        *   **Health check**: Set it up. For example, set the `Path` to /api for a health check endpoint.
        *   **Security**: Configure security groups and IAM roles.
    *   Click "Create & deploy".

## CI/CD Deployment (Automated)

The `devops/ci-cd/backend-pipeline.yml` file contains the GitHub Actions workflow for automating the backend deployment. This workflow is triggered on pushes to the `main` branch that modify files within the `backend/` directory.

**Workflow Steps:**

1.  **Checkout Code:** Checks out the repository.
2.  **Set up Node.js:** Configures the Node.js environment.
3.  **Install Dependencies:** Installs project dependencies using `pnpm`.
4.  **Run Linters and Tests:** Executes linters and unit tests.
5.  **Build Backend:** Builds the backend application.
6.  **Configure AWS Credentials:** Authenticates with AWS using stored secrets.
7.  **Login to ECR:** Logs in to your Amazon ECR registry.
8.  **Build and Push Docker Image:** Builds a Docker image, tags it with the Git commit SHA, and pushes it to ECR.
9.  **Deploy to AWS App Runner:** *This is a placeholder*.  You'll need to use an appropriate GitHub Action or AWS CLI commands to update your App Runner service with the new image.
10. **Notifications:** Sends success/failure notifications (example provided).

**Important Considerations:**

*   **Database Migrations:** The provided example does *not* include database migration steps.  You *must* add a step to run your Prisma migrations (e.g., `pnpm prisma migrate deploy`) before deploying the new application code.  This is best done as a separate job within the pipeline, or as a Kubernetes Job.
*   **Error Handling:** Implement robust error handling and rollback procedures.
*   **Monitoring:** Configure CloudWatch or another monitoring tool to track application health and performance.

---