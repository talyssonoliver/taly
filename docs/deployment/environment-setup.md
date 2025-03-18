# Environment Setup for Taly CRM

This document outlines the steps to set up your development, staging, and production environments for the Taly CRM platform.

## Prerequisites

-   **Node.js and pnpm:** Install the latest LTS version of Node.js (v20+) and pnpm (version 8 or higher).
-   **Docker:** Install Docker Desktop (or Docker Engine and Docker Compose).
-   **AWS Account:**  Create an AWS account (or use an existing one). You will need:
    -   An IAM user with appropriate permissions (see below).
    -   AWS CLI installed and configured.
    -   An Amazon ECR (Elastic Container Registry) repository for your backend images.
-   **GitHub Account:** Required for CI/CD with GitHub Actions.
-   **Serverless Framework:** Install the Serverless Framework CLI globally: `npm install -g serverless`.
-   **Netlify or Vercel Account (for frontend):** Choose one and create an account.

## AWS Permissions (IAM)

Your IAM user needs permissions to:

*   **ECR:**
    *   `ecr:GetAuthorizationToken`
    *   `ecr:BatchCheckLayerAvailability`
    *   `ecr:GetDownloadUrlForLayer`
    *   `ecr:BatchGetImage`
    *   `ecr:PutImage`
    *   `ecr:InitiateLayerUpload`
    *   `ecr:UploadLayerPart`
    *   `ecr:CompleteLayerUpload`
*   **App Runner:** (Or ECS Fargate, if you choose that)
    *   `apprunner:CreateService`
    *   `apprunner:UpdateService`
    *   `apprunner:DeleteService`
    *   `apprunner:DescribeService`
    *   `apprunner:ListServices`
    *   `iam:PassRole` (if App Runner needs to access other AWS services)
*   **CloudWatch Logs:** (For viewing logs)
    *   `logs:CreateLogGroup`
    *   `logs:CreateLogStream`
    *   `logs:PutLogEvents`
*   **S3:** (If using serverless functions that interact with S3)
    *   `s3:GetObject`
    *   `s3:PutObject`
    *   `s3:DeleteObject`
    *   `s3:ListBucket`
* **DynamoDB:** (If using serverless function that interact with DynamoDB)
  * `dynamodb:*`
* **Lambda:** (If using serverless function)
  *  `lambda:*`
*  **IAM**
  *  `iam:PassRole`
* **CloudWatch Events** (For scheduling serverless functions)
  * `events:*`
* **CloudFront/S3** (If you deploy the frontend to S3, which I don't recommend initially.)

**Best Practice:**  Create a dedicated IAM policy with *only* the required permissions, rather than using overly permissive policies like `AdministratorAccess`.  Use the principle of least privilege.

## Local Development Environment

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/taly.git
    cd taly
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Environment Variables:**

    *   Create a `.env` file in the `backend/` directory.  Copy the contents of `.env.example` and fill in the values.  *Do not commit the `.env` file!*
    *   Create a `.env` file in each of the frontend directories (`apps/dashboard`, `apps/booking`, `apps/payments`).  These will likely contain `NEXT_PUBLIC_API_BASE_URL` pointing to your local backend.
    *   For serverless functions, create `.env` files within each function's directory (`serverless/send-email`, etc.)

4.  **Database:**

    *   Using Docker Compose (recommended for local development):
        ```bash
        docker-compose up -d
        ```
        This starts PostgreSQL and Redis.
    *  Run migrations (inside the `api` directory).
      ```
        pnpm prisma migrate dev
      ```
      ```
        pnpm prisma db seed
      ```

5.  **Start the Backend:**

    ```bash
    cd api
    pnpm dev
    ```

6.  **Start the Frontend (Dashboard, Booking, Payments - in separate terminals):**

    ```bash
    cd apps/dashboard  # Or booking, or payments
    pnpm dev
    ```

7.  **Run Serverless Functions Locally (Optional):**
    *   Navigate to a specific serverless function directory (e.g., `serverless/send-email`).
    *  Install dependecies `pnpm install`
    *   Run `serverless offline`.

## Staging and Production Environments

-   **Backend:** Use AWS App Runner (or ECS Fargate) to deploy the backend API.
-   **Frontend:** Use Netlify, Vercel, or AWS Amplify for deploying the frontend applications.
-   **Serverless Functions:** Deploy using the Serverless Framework (`serverless deploy`).
-   **Database:** Use Amazon RDS for PostgreSQL.
-   **Cache:** Use Amazon ElastiCache for Redis.

**Detailed instructions for each environment are provided in the corresponding deployment guides.**

---

## GitHub Actions Secrets

Configure the following secrets in your GitHub repository settings (**Settings > Secrets and variables > Actions**):

*   `AWS_ACCESS_KEY_ID`
*   `AWS_SECRET_ACCESS_KEY`
*   `AWS_REGION`
*   `DATABASE_URL` (for staging and production)
*   `JWT_SECRET`
*   `NEXTAUTH_SECRET`
*   `GOOGLE_CLIENT_ID` (if using Google OAuth)
*   `GOOGLE_CLIENT_SECRET` (if using Google OAuth)
*   `STRIPE_SECRET_KEY` (if using Stripe)
*  `PAYPAL_CLIENT_ID` (if using Paypal)
*  `PAYPAL_CLIENT_SECRET`(if using Paypal)
* `SLACK_WEBHOOK_URL` (optional, for Slack notifications)

---