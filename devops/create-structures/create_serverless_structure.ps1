# Create directories for serverless functions
New-Item -ItemType Directory -Path "serverless/send-email/templates" -Force
New-Item -ItemType Directory -Path "serverless/send-email/utils" -Force
New-Item -ItemType Directory -Path "serverless/process-payment/utils" -Force
New-Item -ItemType Directory -Path "serverless/process-payment/tests" -Force
New-Item -ItemType Directory -Path "serverless/generate-reports/templates" -Force
New-Item -ItemType Directory -Path "serverless/generate-reports/utils" -Force
New-Item -ItemType Directory -Path "serverless/cleanup-temp-files/utils" -Force
New-Item -ItemType Directory -Path "serverless/user-activity-logger/utils" -Force
New-Item -ItemType Directory -Path "serverless/shared/dto" -Force
New-Item -ItemType Directory -Path "serverless/shared/auth" -Force
New-Item -ItemType Directory -Path "serverless/shared/notifications" -Force
New-Item -ItemType Directory -Path "serverless/shared/utils" -Force
New-Item -ItemType Directory -Path "serverless/shared/constants" -Force

# Create files for send-email function
New-Item -ItemType File -Path "serverless/send-email/handler.ts"
New-Item -ItemType File -Path "serverless/send-email/templates/booking-confirmation.html"
New-Item -ItemType File -Path "serverless/send-email/templates/payment-receipt.html"
New-Item -ItemType File -Path "serverless/send-email/templates/reminder.html"
New-Item -ItemType File -Path "serverless/send-email/utils/email-sender.ts"
New-Item -ItemType File -Path "serverless/send-email/utils/template-loader.ts"
New-Item -ItemType File -Path "serverless/send-email/utils/email-validator.ts"
New-Item -ItemType File -Path "serverless/send-email/package.json"
New-Item -ItemType File -Path "serverless/send-email/tsconfig.json"
New-Item -ItemType File -Path "serverless/send-email/serverless.yml"

# Create files for process-payment function
New-Item -ItemType File -Path "serverless/process-payment/handler.ts"
New-Item -ItemType File -Path "serverless/process-payment/utils/stripe-integration.ts"
New-Item -ItemType File -Path "serverless/process-payment/utils/paypal-integration.ts"
New-Item -ItemType File -Path "serverless/process-payment/utils/fee-calculator.ts"
New-Item -ItemType File -Path "serverless/process-payment/utils/payment-logger.ts"
New-Item -ItemType File -Path "serverless/process-payment/tests/process-payment.test.ts"
New-Item -ItemType File -Path "serverless/process-payment/package.json"
New-Item -ItemType File -Path "serverless/process-payment/tsconfig.json"
New-Item -ItemType File -Path "serverless/process-payment/serverless.yml"

# Create files for generate-reports function
New-Item -ItemType File -Path "serverless/generate-reports/handler.ts"
New-Item -ItemType File -Path "serverless/generate-reports/templates/revenue-report.xlsx"
New-Item -ItemType File -Path "serverless/generate-reports/templates/booking-report.xlsx"
New-Item -ItemType File -Path "serverless/generate-reports/templates/user-report.xlsx"
New-Item -ItemType File -Path "serverless/generate-reports/utils/report-generator.ts"
New-Item -ItemType File -Path "serverless/generate-reports/utils/data-fetcher.ts"
New-Item -ItemType File -Path "serverless/generate-reports/utils/file-saver.ts"
New-Item -ItemType File -Path "serverless/generate-reports/package.json"
New-Item -ItemType File -Path "serverless/generate-reports/tsconfig.json"
New-Item -ItemType File -Path "serverless/generate-reports/serverless.yml"

# Create files for cleanup-temp-files function
New-Item -ItemType File -Path "serverless/cleanup-temp-files/handler.ts"
New-Item -ItemType File -Path "serverless/cleanup-temp-files/utils/s3-cleaner.ts"
New-Item -ItemType File -Path "serverless/cleanup-temp-files/utils/file-logger.ts"
New-Item -ItemType File -Path "serverless/cleanup-temp-files/package.json"
New-Item -ItemType File -Path "serverless/cleanup-temp-files/tsconfig.json"
New-Item -ItemType File -Path "serverless/cleanup-temp-files/serverless.yml"

# Create files for user-activity-logger function
New-Item -ItemType File -Path "serverless/user-activity-logger/handler.ts"
New-Item -ItemType File -Path "serverless/user-activity-logger/utils/activity-formatter.ts"
New-Item -ItemType File -Path "serverless/user-activity-logger/utils/logger.ts"
New-Item -ItemType File -Path "serverless/user-activity-logger/package.json"
New-Item -ItemType File -Path "serverless/user-activity-logger/tsconfig.json"
New-Item -ItemType File -Path "serverless/user-activity-logger/serverless.yml"

# Create files for shared resources
New-Item -ItemType File -Path "serverless/shared/dto/base.dto.ts"
New-Item -ItemType File -Path "serverless/shared/dto/error-response.dto.ts"
New-Item -ItemType File -Path "serverless/shared/auth/jwt-helper.ts"
New-Item -ItemType File -Path "serverless/shared/auth/roles.guard.ts"
New-Item -ItemType File -Path "serverless/shared/auth/user.decorator.ts"
New-Item -ItemType File -Path "serverless/shared/notifications/email-sender.ts"
New-Item -ItemType File -Path "serverless/shared/notifications/sms-sender.ts"
New-Item -ItemType File -Path "serverless/shared/notifications/notification-logger.ts"
New-Item -ItemType File -Path "serverless/shared/utils/logger.ts"
New-Item -ItemType File -Path "serverless/shared/utils/http-helper.ts"
New-Item -ItemType File -Path "serverless/shared/utils/database.ts"
New-Item -ItemType File -Path "serverless/shared/utils/event-emitter.ts"
New-Item -ItemType File -Path "serverless/shared/constants/index.ts"
New-Item -ItemType File -Path "serverless/shared/package.json"
New-Item -ItemType File -Path "serverless/shared/tsconfig.json"
New-Item -ItemType File -Path "serverless/shared/README.md"

# Create README file for serverless
New-Item -ItemType File -Path "serverless/README.md"