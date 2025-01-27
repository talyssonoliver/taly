# Create directories for tests
New-Item -ItemType Directory -Path "tests/performance/load-testing" -Force
New-Item -ItemType Directory -Path "tests/performance/stress-testing" -Force
New-Item -ItemType Directory -Path "tests/unit/backend" -Force
New-Item -ItemType Directory -Path "tests/unit/frontend/components" -Force
New-Item -ItemType Directory -Path "tests/unit/frontend/hooks" -Force
New-Item -ItemType Directory -Path "tests/unit/frontend/utils" -Force
New-Item -ItemType Directory -Path "tests/unit/serverless" -Force
New-Item -ItemType Directory -Path "tests/integration/backend" -Force
New-Item -ItemType Directory -Path "tests/integration/frontend" -Force
New-Item -ItemType Directory -Path "tests/integration/utils" -Force
New-Item -ItemType Directory -Path "tests/integration/serverless" -Force
New-Item -ItemType Directory -Path "tests/e2e/api" -Force
New-Item -ItemType Directory -Path "tests/e2e/ui" -Force
New-Item -ItemType Directory -Path "tests/mocks" -Force
New-Item -ItemType Directory -Path "tests/coverage/backend-coverage" -Force
New-Item -ItemType Directory -Path "tests/coverage/frontend-coverage" -Force
New-Item -ItemType Directory -Path "tests/coverage/serverless-coverage" -Force
New-Item -ItemType Directory -Path "tests/data-fixtures" -Force

# Create files for performance tests
New-Item -ItemType File -Path "tests/performance/load-testing/auth-load-test.yml"
New-Item -ItemType File -Path "tests/performance/load-testing/booking-load-test.yml"
New-Item -ItemType File -Path "tests/performance/load-testing/payment-load-test.yml"
New-Item -ItemType File -Path "tests/performance/load-testing/notification-load-test.yml"
New-Item -ItemType File -Path "tests/performance/stress-testing/auth-stress-test.yml"
New-Item -ItemType File -Path "tests/performance/stress-testing/booking-stress-test.yml"
New-Item -ItemType File -Path "tests/performance/stress-testing/payment-stress-test.yml"
New-Item -ItemType File -Path "tests/performance/stress-testing/notification-stress-test.yml"
New-Item -ItemType File -Path "tests/performance/README.md"

# Create files for unit tests
New-Item -ItemType File -Path "tests/unit/backend/auth.service.spec.ts"
New-Item -ItemType File -Path "tests/unit/backend/booking.service.spec.ts"
New-Item -ItemType File -Path "tests/unit/backend/payment.service.spec.ts"
New-Item -ItemType File -Path "tests/unit/backend/notification.service.spec.ts"
New-Item -ItemType File -Path "tests/unit/frontend/components/Button.spec.tsx"
New-Item -ItemType File -Path "tests/unit/frontend/components/Modal.spec.tsx"
New-Item -ItemType File -Path "tests/unit/frontend/hooks/useAuth.spec.ts"
New-Item -ItemType File -Path "tests/unit/frontend/utils/date-helper.spec.ts"
New-Item -ItemType File -Path "tests/unit/serverless/send-email.spec.ts"
New-Item -ItemType File -Path "tests/unit/serverless/process-payment.spec.ts"
New-Item -ItemType File -Path "tests/unit/serverless/generate-reports.spec.ts"

# Create files for integration tests
New-Item -ItemType File -Path "tests/integration/backend/auth.integration.spec.ts"
New-Item -ItemType File -Path "tests/integration/backend/booking.integration.spec.ts"
New-Item -ItemType File -Path "tests/integration/backend/payment.integration.spec.ts"
New-Item -ItemType File -Path "tests/integration/frontend/dashboard.integration.spec.ts"
New-Item -ItemType File -Path "tests/integration/frontend/booking-page.integration.spec.ts"
New-Item -ItemType File -Path "tests/integration/frontend/payment-page.integration.spec.ts"
New-Item -ItemType File -Path "tests/integration/utils/logger.spec.ts"
New-Item -ItemType File -Path "tests/integration/utils/date-helper.spec.ts"

# Create files for e2e tests
New-Item -ItemType File -Path "tests/e2e/api/auth.e2e.spec.ts"
New-Item -ItemType File -Path "tests/e2e/api/booking.e2e.spec.ts"
New-Item -ItemType File -Path "tests/e2e/api/payment.e2e.spec.ts"
New-Item -ItemType File -Path "tests/e2e/ui/login.e2e.spec.ts"
New-Item -ItemType File -Path "tests/e2e/ui/dashboard.e2e.spec.ts"
New-Item -ItemType File -Path "tests/e2e/ui/booking-page.e2e.spec.ts"

# Create files for mocks
New-Item -ItemType File -Path "tests/mocks/auth-mock.ts"
New-Item -ItemType File -Path "tests/mocks/payment-mock.ts"
New-Item -ItemType File -Path "tests/mocks/database-mock.ts"

# Create files for coverage
New-Item -ItemType File -Path "tests/coverage/README.md"

# Create files for data fixtures
New-Item -ItemType File -Path "tests/data-fixtures/users.json"
New-Item -ItemType File -Path "tests/data-fixtures/bookings.json"
New-Item -ItemType File -Path "tests/data-fixtures/payments.json"

# Create README file for tests
New-Item -ItemType File -Path "tests/README.md"