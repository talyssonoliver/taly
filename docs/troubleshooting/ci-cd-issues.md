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

**📚 Next Steps:** [Rollback Procedures for Taly Platform](deployment/rollback.md)