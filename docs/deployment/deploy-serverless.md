# Deploying Taly Serverless Functions

This document outlines how to deploy the serverless functions within the Taly platform using the Serverless Framework.

## Prerequisites

-   **Node.js and pnpm:** Ensure you have Node.js (v18+) and pnpm installed.
-   **AWS Account and Credentials:** You'll need an AWS account and an IAM user with appropriate permissions (see [Environment Setup](environment-setup.md) for details).
-   **Serverless Framework CLI:** Install the Serverless Framework CLI globally:
    ```bash
    npm install -g serverless
    ```

## Directory Structure

Serverless functions are located in the `serverless/` directory, organized by functionality:
serverless/
├── cleanup-temp-files/
│ ├── handler.ts # Function code
│ ├── serverless.yml # Serverless Framework configuration
│ └── ...
├── generate-reports/
│ ├── ...
├── process-payment/
│ ├── ...
├── send-email/
│ ├── ...
└── shared/ # Shared code between functions


## Deployment Steps

1.  **Navigate to the Function Directory:**

    ```bash
    cd serverless/send-email  # Replace with the function you want to deploy
    ```

2.  **Install Dependencies:**

    ```bash
    pnpm install
    ```

3.  **Configure Environment Variables:**

    *   Create a `.env` file in the function's directory (if needed).
    *   Set any required environment variables (e.g., API keys, database URLs). See the individual function's README for specific variables.

4.  **Deploy the Function:**

    ```bash
    serverless deploy --stage prod  # Or 'dev', 'staging', etc.
    ```

    *   **`--stage`:** Specifies the deployment stage (e.g., `dev`, `staging`, `prod`).  You can use different AWS accounts or configurations for different stages.  You *must* configure these stages in your `serverless.yml` file.

5.  **Verify Deployment:**

    *   The Serverless Framework output will show the deployed function's endpoint (if it's an HTTP function) or other relevant information.
    *   You can also check the AWS Lambda console (or your cloud provider's equivalent) to verify the function's deployment.

## Invoking Functions Locally (for testing)

You can test your functions locally before deploying them:

```bash
serverless invoke local -f sendEmail  