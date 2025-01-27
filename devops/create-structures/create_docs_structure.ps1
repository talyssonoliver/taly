# Create directories for documentation
New-Item -ItemType Directory -Path "docs/architecture/diagrams" -Force
New-Item -ItemType Directory -Path "docs/architecture/decisions" -Force
New-Item -ItemType Directory -Path "docs/security" -Force
New-Item -ItemType Directory -Path "docs/api-docs" -Force
New-Item -ItemType Directory -Path "docs/deployment" -Force
New-Item -ItemType Directory -Path "docs/onboarding" -Force
New-Item -ItemType Directory -Path "docs/troubleshooting" -Force
New-Item -ItemType Directory -Path "docs/user-guides" -Force
New-Item -ItemType Directory -Path "docs/testing" -Force

# Create files for architecture documentation
New-Item -ItemType File -Path "docs/architecture/diagrams/system-overview.png"
New-Item -ItemType File -Path "docs/architecture/diagrams/microservices.png"
New-Item -ItemType File -Path "docs/architecture/diagrams/database-schema.png"
New-Item -ItemType File -Path "docs/architecture/diagrams/data-flow.png"
New-Item -ItemType File -Path "docs/architecture/architecture.md"
New-Item -ItemType File -Path "docs/architecture/decisions/decision-001-event-bus.md"
New-Item -ItemType File -Path "docs/architecture/decisions/decision-002-auth-methods.md"

# Create files for security documentation
New-Item -ItemType File -Path "docs/security/security-checklist.md"
New-Item -ItemType File -Path "docs/security/encryption.md"
New-Item -ItemType File -Path "docs/security/authentication.md"
New-Item -ItemType File -Path "docs/security/authorization.md"
New-Item -ItemType File -Path "docs/security/data-protection.md"

# Create files for API documentation
New-Item -ItemType File -Path "docs/api-docs/auth-api.md"
New-Item -ItemType File -Path "docs/api-docs/booking-api.md"
New-Item -ItemType File -Path "docs/api-docs/payment-api.md"
New-Item -ItemType File -Path "docs/api-docs/notification-api.md"
New-Item -ItemType File -Path "docs/api-docs/postman-collection.json"

# Create files for deployment documentation
New-Item -ItemType File -Path "docs/deployment/environment-setup.md"
New-Item -ItemType File -Path "docs/deployment/deploy-backend.md"
New-Item -ItemType File -Path "docs/deployment/deploy-frontend.md"
New-Item -ItemType File -Path "docs/deployment/deploy-serverless.md"
New-Item -ItemType File -Path "docs/deployment/rollback.md"

# Create files for onboarding documentation
New-Item -ItemType File -Path "docs/onboarding/introduction.md"
New-Item -ItemType File -Path "docs/onboarding/tools.md"
New-Item -ItemType File -Path "docs/onboarding/setup-local-environment.md"
New-Item -ItemType File -Path "docs/onboarding/team-contacts.md"

# Create files for troubleshooting documentation
New-Item -ItemType File -Path "docs/troubleshooting/common-issues.md"
New-Item -ItemType File -Path "docs/troubleshooting/k8s-issues.md"
New-Item -ItemType File -Path "docs/troubleshooting/ci-cd-issues.md"
New-Item -ItemType File -Path "docs/troubleshooting/database-issues.md"

# Create files for user guides
New-Item -ItemType File -Path "docs/user-guides/admin-guide.md"
New-Item -ItemType File -Path "docs/user-guides/user-guide.md"
New-Item -ItemType File -Path "docs/user-guides/faq.md"

# Create files for testing documentation
New-Item -ItemType File -Path "docs/testing/unit-testing.md"
New-Item -ItemType File -Path "docs/testing/integration-testing.md"
New-Item -ItemType File -Path "docs/testing/e2e-testing.md"
New-Item -ItemType File -Path "docs/testing/performance-testing.md"

# Create other documentation files
New-Item -ItemType File -Path "docs/glossary.md"
New-Item -ItemType File -Path "docs/contributing.md"
New-Item -ItemType File -Path "docs/README.md"
New-Item -ItemType File -Path "docs/LICENSE.md"