# Troubleshooting Common Issues in Taly CRM

This document outlines common issues you might encounter while developing, deploying, or running the Taly CRM platform, along with potential solutions.

---

## General Issues

### **1. Installation Problems**

*   **Problem:** `pnpm install` fails with errors.
*   **Possible Causes:**
    *   Outdated Node.js or pnpm version.
    *   Corrupted `pnpm-lock.yaml` file.
    *   Network connectivity issues.
    *   Permissions issues.
*   **Solutions:**
    *   Ensure you're using the correct Node.js version (specified in `package.json`'s `engines` field) and pnpm version. Use a Node version manager (nvm, fnm) to manage versions.
    *   Delete the `node_modules` directory and the `pnpm-lock.yaml` file, then run `pnpm install` again. This will regenerate the lockfile.  *Use this as a last resort*, as it can introduce dependency issues.
    *   Check your internet connection.
    *   Ensure you have the necessary permissions to install packages. On Linux/macOS, avoid using `sudo` with `pnpm install` unless absolutely necessary.
    *   If you see errors related to `node-gyp`, you might be missing build tools.  On Windows, you may need to install the "Windows Build Tools".  On macOS, you might need the Xcode Command Line Tools.  On Linux, you'll need the appropriate build-essential packages.
    *   If none of the above work, try a "scorched earth" clean: `pnpm clean:full` (this runs `rimraf` on `node_modules`, `.turbo`, `.next`, and `dist`).  This will remove *all* cached build artifacts and dependencies.

### **2. Application Not Starting**

*   **Problem:** The backend or frontend application fails to start.
*   **Possible Causes:**
    *   Missing environment variables.
    *   Port conflicts.
    *   Syntax errors or runtime errors in the code.
    *   Database connection issues.
*   **Solutions:**
    *   **Check `.env` files:** Ensure all required environment variables are defined in the `.env` files in the relevant directories (`api/`, `apps/dashboard/`, etc.).  Compare them to the `.env-example` files.
    *   **Verify Ports:** Make sure the ports used by the applications (e.g., 3000 for the backend, 3001 for the dashboard) are not already in use. You might need to stop other processes using those ports.
    *   **Examine Logs:** Carefully check the console output for error messages.  Look for syntax errors, missing modules, or database connection errors.
    *   **Database Connection:** Ensure the PostgreSQL database (started via Docker Compose) is running and accessible.  Check the `DATABASE_URL` environment variable.
    *  If using Docker, make sure docker is running.

### **3. "Cannot find module" Error**

*   **Problem:**  The application fails to start with an error like `Cannot find module '...'`.
*   **Possible Causes:**
    *   Missing dependency.
    *   Incorrect import path.
    *   TypeScript compilation issues.
*   **Solutions:**
    *   **Reinstall Dependencies:** Run `pnpm install` in the relevant directory (backend or frontend app).
    *   **Check Import Paths:** Ensure the import paths in your code are correct, especially for shared modules (`@shared`, `@api`, etc.).  Check your `tsconfig.json` files for correct path mappings.
    *   **TypeScript Compilation:** If you've made changes to TypeScript files, make sure they are being compiled correctly.  Run `pnpm build` in the relevant directory.

### **4. API Request Failures**

*   **Problem:** Frontend requests to the backend API fail.
*   **Possible Causes:**
    *   Backend server not running.
    *   Incorrect API endpoint URL.
    *   Network connectivity issues.
    *   CORS (Cross-Origin Resource Sharing) problems.
    *   Authentication or authorization failures.
*   **Solutions:**
    *   **Verify Backend:** Ensure the backend API server is running and accessible.
    *   **Check API URL:**  Double-check the `NEXT_PUBLIC_API_BASE_URL` environment variable in your frontend application.  It should point to the correct URL of your backend API (e.g., `http://localhost:4000` for local development).
    *   **Network:** Ensure there are no firewall rules or network configurations blocking communication between the frontend and backend.
    *   **CORS:** If the frontend and backend are on different origins (different domains or ports), you might need to configure CORS on the backend to allow requests from the frontend origin.  This is usually handled in the NestJS application setup.
    *   **Authentication:** If the API endpoint requires authentication, make sure you're including a valid JWT in the `Authorization` header (e.g., `Authorization: Bearer <YOUR_TOKEN>`).

### **5. 404 Not Found Errors**

* **Problem:** Accessing a specific route gives you a 404 error, in development or production environment
* **Possible Causes:**
  *   The route is not correctly defined in the corresponding controller.
  *   The request URL is incorrect.
  *   The server is not running or is not properly configured.
  *    Routing problems in the frontend application (Next.js).
* **Solutions:**
     *  Double-check the controllers files to confirm the correct route.
     *  Check that the URL is spelled correctly.
     *  If the backend is running in a Docker container, ensure that the ports are correctly mapped and that there are no firewall rules.
     *  In Next.js, make sure your pages are correctly placed within the `pages` directory and that any dynamic route parameters are properly handled.

---

## Database Issues

### **1. Connection Errors**

*   **Problem:**  The application cannot connect to the PostgreSQL database.
*   **Possible Causes:**
    *   Incorrect `DATABASE_URL` environment variable.
    *   Database server not running.
    *   Network connectivity issues.
    *   Firewall blocking connections.
*   **Solutions:**
    *   **Verify `DATABASE_URL`:**  Double-check the `DATABASE_URL` in your `.env` file.  It should follow the format: `postgresql://username:password@host:port/database`.  Ensure the username, password, host, port, and database name are correct.
    *   **Docker Compose:** If using Docker Compose, make sure the `db` service is running (`docker-compose ps`).  If not, try restarting it (`docker-compose restart db`).
    *   **Network:**  Ensure there are no firewalls blocking connections between your application and the database server.
    *   **PostgreSQL Server:** If you're running PostgreSQL directly (not in Docker), make sure the PostgreSQL server is running and accepting connections on the specified port (usually 5432).

### **2. Migration Errors**

*   **Problem:**  `pnpm prisma migrate dev` fails.
*   **Possible Causes:**
    *   Syntax errors in your `schema.prisma` file.
    *   Conflicts between the schema and the existing database state.
    *   Missing database credentials.
*   **Solutions:**
    *   **Check Schema:** Carefully review your `schema.prisma` file for any syntax errors or inconsistencies.
    *   **Reset Database:**  If you're in development, you can try resetting the database:
        ```bash
        pnpm prisma migrate reset
        ```
        **Warning:** This will *delete* all data in your development database.
    *   **Resolve Conflicts:** If there are conflicts between the schema and the existing database, you may need to manually resolve them.  Prisma provides tools for this (see the Prisma documentation).
    *   **Credentials:**  Ensure your `DATABASE_URL` is correct.

### **3. Data Not Showing**

*   **Problem:**  Data you expect to see in the application is not appearing.
*   **Possible Causes:**
    *   Incorrect database queries.
    *   Data not being seeded correctly.
    *   Caching issues.
*   **Solutions:**
    *   **Check Queries:**  Use logging (e.g., `console.log` in your service methods) to inspect the SQL queries generated by Prisma.  Ensure they are fetching the correct data.
    *   **Verify Seed Data:**  Run `pnpm prisma db seed` to re-seed the database with initial data.
    *   **Clear Cache:** If you're using Redis for caching, try flushing the cache.  This can be done using the Redis CLI or a Redis client library.

---

## Frontend Issues

### **1. Components Not Rendering**

*   **Problem:**  React components are not rendering correctly, or you see blank pages.
*   **Possible Causes:**
    *   JavaScript errors in your components.
    *   Incorrect import paths.
    *   Typos in component names.
*   **Solutions:**
    *   **Check Developer Console:**  Open your browser's developer console (usually F12) and look for JavaScript errors.
    *   **Verify Imports:**  Double-check the import paths for your components, especially when using shared components.
    *   **Component Names:**  Ensure you're using the correct component names and that they are properly capitalized.

### **2. Styling Issues**

*   **Problem:**  Styles are not being applied correctly, or the layout is broken.
*   **Possible Causes:**
    *   Incorrect CSS class names.
    *   Conflicting styles.
    *   Missing Tailwind CSS configuration.
*   **Solutions:**
    *   **Inspect Elements:** Use your browser's developer tools to inspect the elements and see which styles are being applied.
    *   **Check Class Names:** Verify that you're using the correct Tailwind CSS class names.
    *   **Tailwind Configuration:** Make sure your `tailwind.config.js` file is correctly configured, and that you've included all necessary paths in the `content` array.
    * **Conflicting styles** Check if any style is not been overwritten by another.

### **3. Build errors:**
- **Possible Cause:** Misconfiguration or incompatible packages.
- **Solution:**
    *   Run a clean build to ensure there is no cached files or configurations that is causing the problem:
        ```
          pnpm clean:full
          pnpm install
        ```

---

## Serverless Functions

### **1. Function Not Triggering**

*   **Problem:**  A serverless function is not being triggered by its configured event.
*   **Possible Causes:**
    *   Incorrect event configuration in `serverless.yml`.
    *   Event source (e.g., SNS topic, S3 bucket) not properly configured.
    *   IAM permissions issues.
*   **Solutions:**
    *   **Verify `serverless.yml`:**  Double-check the `events` section of your function's configuration in `serverless.yml`.  Ensure the event source (e.g., SNS topic ARN, S3 bucket name) is correct.
    *   **Event Source Configuration:**  Ensure the event source (e.g., SNS, S3) is configured to trigger your Lambda function.  Check the event source's configuration in the AWS console.
    *   **IAM Permissions:**  Make sure your Lambda function's IAM role has the necessary permissions to access the event source and any other AWS resources it needs.

### **2. Function Execution Errors**

*   **Problem:**  The function runs but produces an error.
*   **Possible Causes:**
    *   Runtime errors in your code.
    *   Missing environment variables.
    *   Incorrect dependencies.
    *   Timeouts.
*   **Solutions:**
    *   **Check Logs:**  Examine the CloudWatch Logs for your function.  These will contain error messages and stack traces.
    *   **Environment Variables:**  Ensure all required environment variables are set in your `serverless.yml` file.
    *   **Dependencies:**  Make sure all dependencies are listed in your `package.json` file and are installed correctly.
    *   **Timeouts:**  Increase the function's timeout in `serverless.yml` if it's running out of time.  The default is often quite short.
    *   **Local Testing:** Use `serverless invoke local` to test your function locally with simulated events.  This can help isolate issues.

### **3. Deployment Errors**

*   **Problem:**  `serverless deploy` fails.
*   **Possible Causes:**
    *   Errors in `serverless.yml`.
    *   Missing AWS credentials.
    *   Resource limits exceeded.
    *   Conflicts with existing resources.
*   **Solutions:**
    *   **Check `serverless.yml`:**  Carefully review your `serverless.yml` file for syntax errors or invalid configurations.
    *   **AWS Credentials:**  Make sure your AWS credentials are correct and have the necessary permissions.
    *   **Resource Limits:**  If you're hitting AWS resource limits (e.g., maximum number of Lambda functions), you may need to request an increase.
    *   **Resource Conflicts:**  Ensure that the names of your resources (e.g., S3 buckets, Lambda functions) are unique and don't conflict with existing resources.

---

## CI/CD Pipeline Issues

**See `devops/ci-cd/README.md` for details on the CI/CD pipelines.**

### **1. Pipeline Fails on `pnpm install`**

*   **Possible Causes:**
    *   Missing or incorrect `pnpm-lock.yaml` file.
    *   Network connectivity issues.
    *   Outdated version of pnpm in the CI environment.
*   **Solutions:**
    *   Ensure `pnpm-lock.yaml` is committed and up-to-date.
    *   Check your internet connection and proxy settings.
    *   Verify the Node.js and pnpm versions in your CI configuration match your local setup.

### **2. Tests Fail in CI**

*   **Possible Causes:**
    *   Environment differences (e.g., database not set up correctly).
    *   Flaky tests (tests that sometimes pass and sometimes fail).
    *   Missing test dependencies.
*   **Solutions:**
    *   Ensure your tests are isolated and don't depend on external services.
    *   Use mocking to simulate dependencies.
    *   Review test logs for specific error messages.
    *   Run tests locally with the same environment variables as the CI environment.

### **3. Deployment Fails**

*   **Possible Causes:**
    *   Incorrect AWS credentials or permissions.
    *   Errors in your deployment configuration (e.g., `serverless.yml`, Kubernetes manifests).
    *   Resource limits exceeded.
    *   Networking issues.
*   **Solutions:**
    *   **Check Credentials:** Double-check your AWS access keys, secret keys, and region.  Ensure your IAM user has the necessary permissions.
    *   **Review Configuration:** Carefully examine your deployment configuration files for errors.
    *   **Check Logs:** Examine the deployment logs in GitHub Actions and AWS for detailed error messages.
    *   **Resource Limits:** If you're hitting resource limits (e.g., number of Lambda functions), request an increase from AWS.
    * **Networking** Make sure you have the necessary configurations and routes.
---

## Conclusion

By following the troubleshooting steps outlined above, you can resolve common issues encountered during the development, deployment, and operation of the Taly CRM platform. If you encounter an issue that is not covered here, don't hesitate to reach out to the development team for assistance.

**📚 Next Steps:** 
- Review the [Taly Platform Architecture](../architecture/overview.md) to understand the system's design.
- Check the [Deployment Guide](../deployment/overview.md) for instructions on deploying the Taly platform.