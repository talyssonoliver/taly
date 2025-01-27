# Create directories and files for auth-service
New-Item -ItemType Directory -Path "backend/auth-service/src/controllers" -Force
New-Item -ItemType Directory -Path "backend/auth-service/src/services" -Force
New-Item -ItemType Directory -Path "backend/auth-service/src/strategies" -Force
New-Item -ItemType Directory -Path "backend/auth-service/src/modules" -Force
New-Item -ItemType Directory -Path "backend/auth-service/src/dto" -Force
New-Item -ItemType Directory -Path "backend/auth-service/src/guards" -Force
New-Item -ItemType Directory -Path "backend/auth-service/src/utils" -Force
New-Item -ItemType Directory -Path "backend/auth-service/src/config" -Force
New-Item -ItemType Directory -Path "backend/auth-service/prisma/migrations" -Force
New-Item -ItemType Directory -Path "backend/auth-service/tests/e2e" -Force
New-Item -ItemType Directory -Path "backend/auth-service/tests/unit" -Force
New-Item -ItemType Directory -Path "backend/auth-service/tests/mocks" -Force

New-Item -ItemType File -Path "backend/auth-service/src/controllers/auth.controller.ts"
New-Item -ItemType File -Path "backend/auth-service/src/services/auth.service.ts"
New-Item -ItemType File -Path "backend/auth-service/src/strategies/jwt.strategy.ts"
New-Item -ItemType File -Path "backend/auth-service/src/strategies/google.strategy.ts"
New-Item -ItemType File -Path "backend/auth-service/src/strategies/facebook.strategy.ts"
New-Item -ItemType File -Path "backend/auth-service/src/modules/auth.module.ts"
New-Item -ItemType File -Path "backend/auth-service/src/dto/login.dto.ts"
New-Item -ItemType File -Path "backend/auth-service/src/dto/signup.dto.ts"
New-Item -ItemType File -Path "backend/auth-service/src/dto/refresh-token.dto.ts"
New-Item -ItemType File -Path "backend/auth-service/src/guards/jwt-auth.guard.ts"
New-Item -ItemType File -Path "backend/auth-service/src/utils/password-hasher.ts"
New-Item -ItemType File -Path "backend/auth-service/src/utils/token-generator.ts"
New-Item -ItemType File -Path "backend/auth-service/src/main.ts"
New-Item -ItemType File -Path "backend/auth-service/src/app.module.ts"
New-Item -ItemType File -Path "backend/auth-service/src/config/auth.config.ts"
New-Item -ItemType File -Path "backend/auth-service/src/config/jwt.config.ts"
New-Item -ItemType File -Path "backend/auth-service/prisma/schema.prisma"
New-Item -ItemType File -Path "backend/auth-service/prisma/seed.ts"
New-Item -ItemType File -Path "backend/auth-service/tests/e2e/auth.e2e-spec.ts"
New-Item -ItemType File -Path "backend/auth-service/tests/unit/auth.service.spec.ts"
New-Item -ItemType File -Path "backend/auth-service/tests/mocks/jwt-mock.ts"
New-Item -ItemType File -Path "backend/auth-service/Dockerfile"
New-Item -ItemType File -Path "backend/auth-service/package.json"
New-Item -ItemType File -Path "backend/auth-service/tsconfig.json"
New-Item -ItemType File -Path "backend/auth-service/jest.config.js"

# Create directories and files for user-service
New-Item -ItemType Directory -Path "backend/user-service/src/controllers" -Force
New-Item -ItemType Directory -Path "backend/user-service/src/services" -Force
New-Item -ItemType Directory -Path "backend/user-service/src/modules" -Force
New-Item -ItemType Directory -Path "backend/user-service/src/dto" -Force
New-Item -ItemType Directory -Path "backend/user-service/src/utils" -Force
New-Item -ItemType Directory -Path "backend/user-service/src/guards" -Force
New-Item -ItemType Directory -Path "backend/user-service/src/config" -Force
New-Item -ItemType Directory -Path "backend/user-service/prisma/migrations" -Force
New-Item -ItemType Directory -Path "backend/user-service/tests/unit" -Force
New-Item -ItemType Directory -Path "backend/user-service/tests/e2e" -Force

New-Item -ItemType File -Path "backend/user-service/src/controllers/user.controller.ts"
New-Item -ItemType File -Path "backend/user-service/src/services/user.service.ts"
New-Item -ItemType File -Path "backend/user-service/src/modules/user.module.ts"
New-Item -ItemType File -Path "backend/user-service/src/dto/create-user.dto.ts"
New-Item -ItemType File -Path "backend/user-service/src/dto/update-user.dto.ts"
New-Item -ItemType File -Path "backend/user-service/src/dto/user-query.dto.ts"
New-Item -ItemType File -Path "backend/user-service/src/utils/user-mapper.ts"
New-Item -ItemType File -Path "backend/user-service/src/guards/roles.guard.ts"
New-Item -ItemType File -Path "backend/user-service/src/main.ts"
New-Item -ItemType File -Path "backend/user-service/src/app.module.ts"
New-Item -ItemType File -Path "backend/user-service/src/config/user-service.config.ts"
New-Item -ItemType File -Path "backend/user-service/prisma/schema.prisma"
New-Item -ItemType File -Path "backend/user-service/prisma/seed.ts"
New-Item -ItemType File -Path "backend/user-service/tests/unit/user.service.spec.ts"
New-Item -ItemType File -Path "backend/user-service/tests/e2e/user.e2e-spec.ts"
New-Item -ItemType File -Path "backend/user-service/Dockerfile"
New-Item -ItemType File -Path "backend/user-service/package.json"
New-Item -ItemType File -Path "backend/user-service/tsconfig.json"
New-Item -ItemType File -Path "backend/user-service/jest.config.js"

# Create directories and files for booking-service
New-Item -ItemType Directory -Path "backend/booking-service/src/controllers" -Force
New-Item -ItemType Directory -Path "backend/booking-service/src/services" -Force
New-Item -ItemType Directory -Path "backend/booking-service/src/modules" -Force
New-Item -ItemType Directory -Path "backend/booking-service/src/dto" -Force
New-Item -ItemType Directory -Path "backend/booking-service/src/utils" -Force
New-Item -ItemType Directory -Path "backend/booking-service/src/events" -Force
New-Item -ItemType Directory -Path "backend/booking-service/src/config" -Force
New-Item -ItemType Directory -Path "backend/booking-service/prisma/migrations" -Force
New-Item -ItemType Directory -Path "backend/booking-service/tests/unit" -Force
New-Item -ItemType Directory -Path "backend/booking-service/tests/e2e" -Force

New-Item -ItemType File -Path "backend/booking-service/src/controllers/booking.controller.ts"
New-Item -ItemType File -Path "backend/booking-service/src/services/booking.service.ts"
New-Item -ItemType File -Path "backend/booking-service/src/modules/booking.module.ts"
New-Item -ItemType File -Path "backend/booking-service/src/dto/create-booking.dto.ts"
New-Item -ItemType File -Path "backend/booking-service/src/dto/update-booking.dto.ts"
New-Item -ItemType File -Path "backend/booking-service/src/utils/date-utils.ts"
New-Item -ItemType File -Path "backend/booking-service/src/events/booking-created.event.ts"
New-Item -ItemType File -Path "backend/booking-service/src/events/booking-updated.event.ts"
New-Item -ItemType File -Path "backend/booking-service/src/main.ts"
New-Item -ItemType File -Path "backend/booking-service/src/app.module.ts"
New-Item -ItemType File -Path "backend/booking-service/src/config/booking-service.config.ts"
New-Item -ItemType File -Path "backend/booking-service/prisma/schema.prisma"
New-Item -ItemType File -Path "backend/booking-service/prisma/seed.ts"
New-Item -ItemType File -Path "backend/booking-service/tests/unit/"
New-Item -ItemType File -Path "backend/booking-service/tests/e2e/"
New-Item -ItemType File -Path "backend/booking-service/Dockerfile"
New-Item -ItemType File -Path "backend/booking-service/package.json"
New-Item -ItemType File -Path "backend/booking-service/tsconfig.json"
New-Item -ItemType File -Path "backend/booking-service/jest.config.js"

# Create directories and files for payment-service
New-Item -ItemType Directory -Path "backend/payment-service/src/controllers" -Force
New-Item -ItemType Directory -Path "backend/payment-service/src/services" -Force
New-Item -ItemType Directory -Path "backend/payment-service/src/modules" -Force
New-Item -ItemType Directory -Path "backend/payment-service/src/dto" -Force
New-Item -ItemType Directory -Path "backend/payment-service/src/integrations" -Force
New-Item -ItemType Directory -Path "backend/payment-service/src/events" -Force
New-Item -ItemType Directory -Path "backend/payment-service/src/utils" -Force
New-Item -ItemType Directory -Path "backend/payment-service/src/config" -Force
New-Item -ItemType Directory -Path "backend/payment-service/prisma/migrations" -Force
New-Item -ItemType Directory -Path "backend/payment-service/tests/unit" -Force
New-Item -ItemType Directory -Path "backend/payment-service/tests/e2e" -Force
New-Item -ItemType Directory -Path "backend/payment-service/tests/mocks" -Force

New-Item -ItemType File -Path "backend/payment-service/src/controllers/payment.controller.ts"
New-Item -ItemType File -Path "backend/payment-service/src/services/payment.service.ts"
New-Item -ItemType File -Path "backend/payment-service/src/modules/payment.module.ts"
New-Item -ItemType File -Path "backend/payment-service/src/dto/create-payment.dto.ts"
New-Item -ItemType File -Path "backend/payment-service/src/dto/refund-payment.dto.ts"
New-Item -ItemType File -Path "backend/payment-service/src/integrations/stripe.integration.ts"
New-Item -ItemType File -Path "backend/payment-service/src/integrations/paypal.integration.ts"
New-Item -ItemType File -Path "backend/payment-service/src/events/payment-created.event.ts"
New-Item -ItemType File -Path "backend/payment-service/src/events/refund-processed.event.ts"
New-Item -ItemType File -Path "backend/payment-service/src/utils/fee-calculator.ts"
New-Item -ItemType File -Path "backend/payment-service/src/main.ts"
New-Item -ItemType File -Path "backend/payment-service/src/app.module.ts"
New-Item -ItemType File -Path "backend/payment-service/src/config/payment-service.config.ts"
New-Item -ItemType File -Path "backend/payment-service/prisma/schema.prisma"
New-Item -ItemType File -Path "backend/payment-service/prisma/seed.ts"
New-Item -ItemType File -Path "backend/payment-service/tests/unit/payment.service.spec.ts"
New-Item -ItemType File -Path "backend/payment-service/tests/e2e/payment.e2e-spec.ts"
New-Item -ItemType File -Path "backend/payment-service/tests/mocks/stripe-mock.ts"
New-Item -ItemType File -Path "backend/payment-service/Dockerfile"
New-Item -ItemType File -Path "backend/payment-service/package.json"
New-Item -ItemType File -Path "backend/payment-service/tsconfig.json"
New-Item -ItemType File -Path "backend/payment-service/jest.config.js"

# Create directories and files for notification-service
New-Item -ItemType Directory -Path "backend/notification-service/src/controllers" -Force
New-Item -ItemType Directory -Path "backend/notification-service/src/services" -Force
New-Item -ItemType Directory -Path "backend/notification-service/src/modules" -Force
New-Item -ItemType Directory -Path "backend/notification-service/src/templates/email" -Force
New-Item -ItemType Directory -Path "backend/notification-service/src/templates/sms" -Force
New-Item -ItemType Directory -Path "backend/notification-service/src/integrations" -Force
New-Item -ItemType Directory -Path "backend/notification-service/src/events" -Force
New-Item -ItemType Directory -Path "backend/notification-service/src/utils" -Force
New-Item -ItemType Directory -Path "backend/notification-service/src/config" -Force
New-Item -ItemType Directory -Path "backend/notification-service/prisma/migrations" -Force
New-Item -ItemType Directory -Path "backend/notification-service/tests/unit" -Force
New-Item -ItemType Directory -Path "backend/notification-service/tests/e2e" -Force
New-Item -ItemType Directory -Path "backend/notification-service/tests/mocks" -Force

New-Item -ItemType File -Path "backend/notification-service/src/controllers/notification.controller.ts"
New-Item -ItemType File -Path "backend/notification-service/src/services/notification.service.ts"
New-Item -ItemType File -Path "backend/notification-service/src/modules/notification.module.ts"
New-Item -ItemType File -Path "backend/notification-service/src/templates/email/booking-reminder.html"
New-Item -ItemType File -Path "backend/notification-service/src/templates/email/payment-receipt.html"
New-Item -ItemType File -Path "backend/notification-service/src/templates/sms/booking-reminder.txt"
New-Item -ItemType File -Path "backend/notification-service/src/templates/sms/payment-receipt.txt"
New-Item -ItemType File -Path "backend/notification-service/src/integrations/twilio.integration.ts"
New-Item -ItemType File -Path "backend/notification-service/src/integrations/ses.integration.ts"
New-Item -ItemType File -Path "backend/notification-service/src/events/booking-notification.event.ts"
New-Item -ItemType File -Path "backend/notification-service/src/events/payment-notification.event.ts"
New-Item -ItemType File -Path "backend/notification-service/src/utils/message-formatter.ts"
New-Item -ItemType File -Path "backend/notification-service/src/main.ts"
New-Item -ItemType File -Path "backend/notification-service/src/app.module.ts"
New-Item -ItemType File -Path "backend/notification-service/src/config/notification-service.config.ts"
New-Item -ItemType File -Path "backend/notification-service/prisma/schema.prisma"
New-Item -ItemType File -Path "backend/notification-service/prisma/seed.ts"
New-Item -ItemType File -Path "backend/notification-service/tests/unit/"
New-Item -ItemType File -Path "backend/notification-service/tests/e2e/"
New-Item -ItemType File -Path "backend/notification-service/tests/mocks/"
New-Item -ItemType File -Path "backend/notification-service/Dockerfile"
New-Item -ItemType File -Path "backend/notification-service/package.json"
New-Item -ItemType File -Path "backend/notification-service/tsconfig.json"
New-Item -ItemType File -Path "backend/notification-service/jest.config.js"

# Create directories and files for message-broker
New-Item -ItemType Directory -Path "backend/message-broker/src/consumers" -Force
New-Item -ItemType Directory -Path "backend/message-broker/src/producers" -Force
New-Item -ItemType Directory -Path "backend/message-broker/src/config" -Force
New-Item -ItemType Directory -Path "backend/message-broker/tests/unit" -Force
New-Item -ItemType Directory -Path "backend/message-broker/tests/e2e" -Force
New-Item -ItemType Directory -Path "backend/message-broker/tests/mocks" -Force

New-Item -ItemType File -Path "backend/message-broker/src/consumers/booking-consumer.ts"
New-Item -ItemType File -Path "backend/message-broker/src/consumers/payment-consumer.ts"
New-Item -ItemType File -Path "backend/message-broker/src/consumers/notification-consumer.ts"
New-Item -ItemType File -Path "backend/message-broker/src/producers/booking-producer.ts"
New-Item -ItemType File -Path "backend/message-broker/src/producers/payment-producer.ts"
New-Item -ItemType File -Path "backend/message-broker/src/producers/notification-producer.ts"
New-Item -ItemType File -Path "backend/message-broker/src/main.ts"
New-Item -ItemType File -Path "backend/message-broker/src/app.module.ts"
New-Item -ItemType File -Path "backend/message-broker/src/config/event-bus.config.ts"
New-Item -ItemType File -Path "backend/message-broker/tests/unit/"
New-Item -ItemType File -Path "backend/message-broker/tests/e2e/"
New-Item -ItemType File -Path "backend/message-broker/tests/mocks/"
New-Item -ItemType File -Path "backend/message-broker/Dockerfile"
New-Item -ItemType File -Path "backend/message-broker/package.json"
New-Item -ItemType File -Path "backend/message-broker/tsconfig.json"
New-Item -ItemType File -Path "backend/message-broker/jest.config.js"

# Create directories and files for shared
New-Item -ItemType Directory -Path "backend/shared/dto" -Force
New-Item -ItemType Directory -Path "backend/shared/utils" -Force
New-Item -ItemType Directory -Path "backend/shared/decorators" -Force
New-Item -ItemType Directory -Path "backend/shared/guards" -Force
New-Item -ItemType Directory -Path "backend/shared/constants" -Force
New-Item -ItemType Directory -Path "backend/shared/events" -Force

New-Item -ItemType File -Path "backend/shared/dto/base.dto.ts"
New-Item -ItemType File -Path "backend/shared/dto/paginated-query.dto.ts"
New-Item -ItemType File -Path "backend/shared/utils/logger.ts"
New-Item -ItemType File -Path "backend/shared/utils/validation.pipe.ts"
New-Item -ItemType File -Path "backend/shared/utils/date-helper.ts"
New-Item -ItemType File -Path "backend/shared/decorators/roles.decorator.ts"

# Create directories for devops
New-Item -ItemType Directory -Path "backend/devops/ci-cd" -Force
New-Item -ItemType Directory -Path "backend/devops/k8s/deployments" -Force
New-Item -ItemType Directory -Path "backend/devops/k8s/services" -Force
New-Item -ItemType Directory -Path "backend/devops/terraform" -Force
New-Item -ItemType Directory -Path "backend/devops/monitoring" -Force

# Create files for ci-cd
New-Item -ItemType File -Path "backend/devops/ci-cd/backend-pipeline.yml"
New-Item -ItemType File -Path "backend/devops/ci-cd/frontend-pipeline.yml"
New-Item -ItemType File -Path "backend/devops/ci-cd/serverless-pipeline.yml"

# Create files for k8s deployments
New-Item -ItemType File -Path "backend/devops/k8s/deployments/auth-deployment.yml"