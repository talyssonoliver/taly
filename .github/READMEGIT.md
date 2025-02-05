# Taly GitHub Workflows and Configurations

This directory contains configuration files and workflows for automating various tasks in the **Taly** project. These configurations ensure streamlined CI/CD processes, security checks, and dependency management.

## Directory Structure

- **workflows/**: Contains GitHub Actions workflows for CI/CD and other automated processes.
  - `backend-pipeline.yml`: Manages backend builds, tests, and deployments.
  - `frontend-ci.yml`: Handles frontend CI tasks such as linting, testing, and building.
  - `serverless-ci.yml`: Manages CI for serverless functions, including deployments.
  - `security-scan.yml`: Automates security scans for dependencies and code.
  - `nightly-build.yml`: Executes nightly builds and tests across the project.

- **CODEOWNERS.md**: Specifies ownership of various parts of the codebase for automatic PR reviews.

- **dependabot.yml**: Configures automated dependency updates for different parts of the project, including npm dependencies and GitHub Actions.

- **PULL_REQUEST_TEMPLATE.md**: Defines a template for pull requests to ensure consistency and clear communication among contributors.

## Purpose

This folder centralizes automation and governance of the Taly repository. Key purposes include:

1. **Continuous Integration/Continuous Deployment (CI/CD)**:
   - Ensures automated testing, building, and deployment pipelines for backend, frontend, and serverless components.

2. **Dependency Management**:
   - Automates updates to project dependencies and GitHub Actions using Dependabot.

3. **Security and Quality**:
   - Automates security checks for dependencies and static code analysis.

4. **Collaboration**:
   - Enforces code ownership and provides PR templates for organized and efficient development processes.

## How to Use

1. **Adding or Modifying Workflows**:
   - Place new workflow files in the `workflows/` directory.
   - Use `.yml` format and follow the GitHub Actions syntax.

2. **Customizing CODEOWNERS**:
   - Update `CODEOWNERS.md` to define or change ownership for specific paths in the repository.

3. **Dependency Updates**:
   - Dependabot automatically creates PRs for dependency updates based on the `dependabot.yml` configuration.

4. **Pull Requests**:
   - Use the PR template defined in `PULL_REQUEST_TEMPLATE.md` for consistent submissions.

## Contributing

- Review the documentation for individual workflows or files before making changes.
- Follow the [contribution guidelines](../docs/contributing.md) for submitting updates or additions.

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Documentation](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically)

---

Feel free to reach out to the **DevOps team** for any questions or issues related to this directory.
