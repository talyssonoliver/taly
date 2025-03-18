
**5. `docs/deployment/rollback.md`**

```markdown
# Rollback Procedures for Taly Platform

This document outlines the procedures for rolling back deployments in the Taly platform in case of failures or unexpected issues.  The rollback strategy depends on the component being deployed.

---

## 1. Backend Services (AWS App Runner)

Since we're using AWS App Runner for the backend, rollbacks are relatively straightforward. App Runner maintains a history of deployments.

**Steps:**

1.  **Access App Runner:** Log in to the AWS Management Console and navigate to the App Runner service.
2.  **Select Your Service:** Choose the relevant service (e.g., `taly-backend`).
3.  **View Deployments:** Go to the "Deployments" tab.
4.  **Identify Previous Deployment:** Find the previous deployment that was working correctly.  This is usually the deployment *before* the one that caused the issue.
5.  **Redeploy Previous Version:** Select the previous deployment and choose "Deploy". App Runner will redeploy that specific image.

**Considerations:**

*   **Database Migrations:** If the deployment included database migrations, rolling back the application code *won't* automatically revert the database changes.  You'll need a separate strategy for database rollbacks:
    *   **Revert Migrations:** If possible, use `prisma migrate resolve --rolled-back <migration_name>` to revert the specific migration.  This is the *best* approach.
    *   **Restore from Backup:** If reverting migrations isn't feasible, restore a database backup from *before* the failed deployment.  This is more disruptive.
*   **Data Loss:**  Rolling back the database might result in data loss (any data created or modified after the backup).

## 2. Frontend Applications (Netlify/Vercel)

Both Netlify and Vercel have built-in rollback capabilities:

1.  **Access Deployment History:** Log in to your Netlify or Vercel dashboard.
2.  **Select Project:** Choose the relevant project (e.g., `taly-dashboard`).
3.  **Find Previous Deployment:** Go to the "Deploys" section.
4.  **Redeploy:** Select the previous working deployment and choose the option to "Publish" or "Redeploy" it.

## 3. Serverless Functions (Serverless Framework)

The Serverless Framework keeps track of previous deployments:

1.  **List Deployments:**

    ```bash
    serverless deploy list -s <stage> # Replace <stage> with your stage (e.g., dev, prod)
    ```

    This will show you a list of previous deployments with their timestamps.

2.  **Rollback to a Previous Deployment:**

    ```bash
    serverless rollback -v <timestamp> -s <stage> # Replace <timestamp> with the timestamp of the deployment you want to roll back to
    ```

**Example:**

```bash
serverless rollback -v 2024-03-08T14:30:00.000Z -s prod