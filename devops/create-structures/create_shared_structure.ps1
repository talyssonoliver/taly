# Create directories for shared utilities and libraries
New-Item -ItemType Directory -Path "shared/common/helpers" -Force
New-Item -ItemType Directory -Path "shared/common/errors" -Force
New-Item -ItemType Directory -Path "shared/ui/components" -Force
New-Item -ItemType Directory -Path "shared/ui/styles" -Force
New-Item -ItemType Directory -Path "shared/constants" -Force
New-Item -ItemType Directory -Path "shared/dto" -Force
New-Item -ItemType Directory -Path "shared/events" -Force
New-Item -ItemType Directory -Path "shared/guards" -Force
New-Item -ItemType Directory -Path "shared/interceptors" -Force
New-Item -ItemType Directory -Path "shared/middlewares" -Force
New-Item -ItemType Directory -Path "shared/utils" -Force
New-Item -ItemType Directory -Path "shared/decorators" -Force
New-Item -ItemType Directory -Path "shared/types" -Force
New-Item -ItemType Directory -Path "shared/logger" -Force
New-Item -ItemType Directory -Path "shared/validation/validators" -Force
New-Item -ItemType Directory -Path "shared/validation/schemas" -Force

# Create files for common helpers and errors
New-Item -ItemType File -Path "shared/common/helpers/date.helper.ts"
New-Item -ItemType File -Path "shared/common/helpers/string.helper.ts"
New-Item -ItemType File -Path "shared/common/helpers/number.helper.ts"
New-Item -ItemType File -Path "shared/common/errors/not-found.error.ts"
New-Item -ItemType File -Path "shared/common/errors/unauthorized.error.ts"
New-Item -ItemType File -Path "shared/common/errors/validation.error.ts"
New-Item -ItemType File -Path "shared/common/README.md"

# Create files for UI components and styles
New-Item -ItemType File -Path "shared/ui/components/Button.tsx"
New-Item -ItemType File -Path "shared/ui/components/Modal.tsx"
New-Item -ItemType File -Path "shared/ui/components/Input.tsx"
New-Item -ItemType File -Path "shared/ui/components/Spinner.tsx"
New-Item -ItemType File -Path "shared/ui/styles/theme.css"
New-Item -ItemType File -Path "shared/ui/styles/globals.css"
New-Item -ItemType File -Path "shared/ui/styles/mixins.css"
New-Item -ItemType File -Path "shared/ui/README.md"

# Create files for constants
New-Item -ItemType File -Path "shared/constants/index.ts"
New-Item -ItemType File -Path "shared/constants/error-messages.ts"

# Create files for DTOs
New-Item -ItemType File -Path "shared/dto/base.dto.ts"
New-Item -ItemType File -Path "shared/dto/paginated-query.dto.ts"
New-Item -ItemType File -Path "shared/dto/error-response.dto.ts"

# Create files for events
New-Item -ItemType File -Path "shared/events/booking-created.event.ts"
New-Item -ItemType File -Path "shared/events/payment-processed.event.ts"
New-Item -ItemType File -Path "shared/events/index.ts"

# Create files for guards
New-Item -ItemType File -Path "shared/guards/jwt-auth.guard.ts"
New-Item -ItemType File -Path "shared/guards/roles.guard.ts"

# Create files for interceptors
New-Item -ItemType File -Path "shared/interceptors/logging.interceptor.ts"
New-Item -ItemType File -Path "shared/interceptors/response.interceptor.ts"

# Create files for middlewares
New-Item -ItemType File -Path "shared/middlewares/rate-limiter.middleware.ts"
New-Item -ItemType File -Path "shared/middlewares/error-handler.middleware.ts"
New-Item -ItemType File -Path "shared/middlewares/request-logger.middleware.ts"

# Create files for utils
New-Item -ItemType File -Path "shared/utils/date-helper.ts"
New-Item -ItemType File -Path "shared/utils/event-emitter.ts"
New-Item -ItemType File -Path "shared/utils/logger.ts"
New-Item -ItemType File -Path "shared/utils/validation.pipe.ts"
New-Item -ItemType File -Path "shared/utils/token-helper.ts"

# Create files for decorators
New-Item -ItemType File -Path "shared/decorators/roles.decorator.ts"
New-Item -ItemType File -Path "shared/decorators/user.decorator.ts"

# Create files for types
New-Item -ItemType File -Path "shared/types/user.interface.ts"
New-Item -ItemType File -Path "shared/types/booking.interface.ts"
New-Item -ItemType File -Path "shared/types/payment.interface.ts"
New-Item -ItemType File -Path "shared/types/notification.interface.ts"
New-Item -ItemType File -Path "shared/types/index.ts"

# Create files for logger
New-Item -ItemType File -Path "shared/logger/logger.service.ts"
New-Item -ItemType File -Path "shared/logger/logger.config.ts"

# Create files for validation
New-Item -ItemType File -Path "shared/validation/validators/email.validator.ts"
New-Item -ItemType File -Path "shared/validation/validators/password.validator.ts"
New-Item -ItemType File -Path "shared/validation/validators/date.validator.ts"
New-Item -ItemType File -Path "shared/validation/schemas/user.schema.ts"
New-Item -ItemType File -Path "shared/validation/schemas/booking.schema.ts"
New-Item -ItemType File -Path "shared/validation/schemas/payment.schema.ts"

# Create README file for shared
New-Item -ItemType File -Path "shared/README.md"