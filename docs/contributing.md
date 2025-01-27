# Contributing to Taly

We’re excited that you’re interested in contributing to Taly! Whether you’re fixing a bug, adding a feature, or improving documentation, your contributions are valuable to us. This guide outlines the process for making contributions to the project.

---

## How to Contribute

### **1. Fork the Repository**
Start by creating your own fork of the Taly repository:
1. Navigate to the Taly GitHub repository: [https://github.com/talyssonoliver/taly](https://github.com/talyssonoliver/taly)
2. Click on the **Fork** button in the upper right corner.
3. Clone your forked repository to your local machine:
   ```bash
   git clone https://github.com/your-username/taly.git
   cd taly
   ```

---

### **2. Set Up Your Environment**
1. Install project dependencies using `pnpm`:
   ```bash
   pnpm install
   ```
2. Start required services locally (e.g., databases, backend services):
   ```bash
   docker-compose up
   ```
3. Ensure all tests pass before making changes:
   ```bash
   pnpm test
   ```

---

### **3. Create a New Branch**
Create a branch to isolate your changes:
```bash
git checkout -b feature/your-feature-name
```
Use descriptive branch names, such as:
- `feature/add-booking-calendar`
- `fix/payment-api-error`
- `docs/update-readme`

---

### **4. Make Your Changes**
1. Write clean and well-documented code following the project’s [coding standards](docs/coding-guidelines.md).
2. Ensure your changes do not break existing functionality by running tests:
   ```bash
   pnpm test
   ```
3. If applicable, add new tests to cover your changes.
4. Update documentation if your changes introduce new features or modify existing ones.

---

### **5. Commit Your Changes**
Write a clear and descriptive commit message using [Conventional Commits](https://www.conventionalcommits.org/):
```bash
feat(auth): add Google OAuth integration

- Implemented OAuth 2.0 for Google login.
- Updated `auth.service.ts` with new endpoints.
- Added unit tests for the feature.
```

Use prefixes such as:
- **feat**: New features.
- **fix**: Bug fixes.
- **docs**: Documentation updates.
- **style**: Code formatting.
- **refactor**: Code restructuring.
- **test**: Adding or updating tests.

---

### **6. Push and Open a Pull Request**
1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request (PR) on the original Taly repository:
   - Go to your forked repository on GitHub.
   - Click the **Compare & Pull Request** button.
   - Provide a clear description of your changes and reference related issues if applicable.

Example PR description:
```
### Description
Added Google OAuth integration to the authentication service, allowing users to log in using their Google accounts.

### Related Issues
- Resolves #123

### Changes
- Added `/auth/google` endpoint.
- Updated frontend to include Google login button.
- Included tests for the new endpoint.

### Checklist
- [x] Tests added.
- [x] Documentation updated.
```

---

### **7. Code Review Process**
1. The Taly team will review your pull request.
2. Be prepared to make updates based on feedback.
3. Once approved, your changes will be merged into the `main` branch.

---

## Contribution Guidelines
- Ensure code quality by following the [coding standards](docs/coding-guidelines.md).
- Add tests for all new functionality.
- Respect existing architecture and design patterns.
- Keep your changes focused and avoid bundling multiple features or fixes into a single pull request.

---

## Code of Conduct
By contributing to Taly, you agree to adhere to our [Code of Conduct](docs/code-of-conduct.md). We value inclusivity and respect among all contributors.

---

## Contact
If you have questions about contributing, feel free to reach out:
- **Email**: dev-support@taly.com
- **GitHub Issues**: [https://github.com/talyssonoliver/taly/issues](https://github.com/talyssonoliver/taly/issues)
