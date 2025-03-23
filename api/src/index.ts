// Module exports for easy imports throughout the app

// Config
export * from "./config/app.config";
export * from "./config/aws.config";
export * from "./config/database.config";
export * from "./config/jwt.config";
export * from "./config/mail.config";
export * from "./config/stripe.config";

// Common
export * from "./common/enums/appointment-status.enum";
export * from "./common/enums/payment-status.enum";
export * from "./common/enums/roles.enum";
export * from "./common/enums/subscription-plan.enum";

export * from "./common/interfaces/jwt-payload.interface";
export * from "./common/interfaces/paginated-result.interface";
export * from "./common/interfaces/response-message.interface";

export * from "./common/utils/crypto.util";
export * from "./common/utils/date.util";
export * from "./common/utils/pagination.util";
export * from "./common/utils/string.util";

export * from "./common/decorators/api-paginated-response.decorator";
export * from "./common/decorators/current-user.decorator";
export * from "./common/decorators/public.decorator";
export * from "./common/decorators/roles.decorator";

export * from "./common/guards/jwt-auth.guard";
export * from "./common/guards/roles.guard";
export * from "./common/guards/throttler.guard";

export * from "./common/filters/http-exception.filter";
export * from "./common/filters/prisma-exception.filter";
export * from "./common/filters/validation.filter";

export * from "./common/interceptors/cache.interceptor";
export * from "./common/interceptors/logging.interceptor";
export * from "./common/interceptors/timeout.interceptor";
export * from "./common/interceptors/transform.interceptor";

export * from "./common/pipes/parse-boolean.pipe";
export * from "./common/pipes/parse-int.pipe";
export * from "./common/pipes/validation.pipe";

// Database
export * from "./database/prisma.service";

// Auth
export * from "./auth/auth.controller";
export * from "./auth/auth.module";
export * from "./auth/auth.service";
export * from "./auth/dto/change-password.dto";
export * from "./auth/dto/forgot-password.dto";
export * from "./auth/dto/login.dto";
export * from "./auth/dto/register.dto";
export * from "./auth/dto/reset-password.dto";
export * from "./auth/guards/local-auth.guard";
export * from "./auth/guards/oauth.guard";
export * from "./auth/guards/refresh-token.guard";
export * from "./auth/interfaces/oauth-user.interface";
export * from "./auth/interfaces/token-response.interface";
export * from "./auth/strategies/facebook.strategy";
export * from "./auth/strategies/google.strategy";
export * from "./auth/strategies/jwt.strategy";
export * from "./auth/strategies/local.strategy";
export * from "./auth/strategies/refresh-token.strategy";

// Users
export * from "./users/dto/create-staff.dto";
export * from "./users/dto/create-user.dto";
export * from "./users/dto/update-user.dto";
export * from "./users/dto/user-response.dto";
export * from "./users/interfaces/staff.interface";
export * from "./users/interfaces/user.interface";
export * from "./users/repositories/role.repository";
export * from "./users/repositories/staff.repository";
export * from "./users/repositories/user.repository";
export * from "./users/users.controller";
export * from "./users/users.module";
export * from "./users/users.resolver";
export * from "./users/users.service";

// Salons
export * from "./companies/dto/create-salon.dto";
export * from "./companies/dto/create-service.dto";
export * from "./companies/dto/salon-response.dto";
export * from "./companies/dto/service-response.dto";
export * from "./companies/dto/update-salon.dto";
export * from "./companies/dto/update-service.dto";
export * from "./companies/dto/working-hours.dto";
export * from "./companies/interfaces/salon.interface";
export * from "./companies/interfaces/service.interface";
export * from "./companies/repositories/salon.repository";
export * from "./companies/repositories/service.repository";
export * from "./companies/repositories/working-hours.repository";
export * from "./companies/salons.controller";
export * from "./companies/salons.module";
export * from "./companies/salons.resolver";
export * from "./companies/salons.service";

// Appointments
export * from "./appointments/appointments.controller";
export * from "./appointments/appointments.module";
export * from "./appointments/appointments.resolver";
export * from "./appointments/appointments.service";
export * from "./appointments/dto/appointment-response.dto";
export * from "./appointments/dto/available-slots.dto";
export * from "./appointments/dto/cancel-appointment.dto";
export * from "./appointments/dto/create-appointment.dto";
export * from "./appointments/dto/reschedule-appointment.dto";
export * from "./appointments/dto/update-appointment.dto";
export * from "./appointments/interfaces/appointment.interface";
export * from "./appointments/interfaces/time-slot-query.interface";
export * from "./appointments/interfaces/time-slot.interface";
export * from "./appointments/repositories/appointment.repository";
export * from "./appointments/repositories/time-slot.repository";

// Clients
export * from "./clients/clients.controller";
export * from "./clients/clients.module";
export * from "./clients/clients.resolver";
export * from "./clients/clients.service";
export * from "./clients/dto/add-client-note.dto";
export * from "./clients/dto/client-response.dto";
export * from "./clients/dto/create-client.dto";
export * from "./clients/dto/import-clients.dto";
export * from "./clients/dto/update-client.dto";
export * from "./clients/interfaces/client-note.interface";
export * from "./clients/interfaces/client.interface";
export * from "./clients/repositories/client-note.repository";
export * from "./clients/repositories/client.repository";

// Payments
export * from "./payments/dto/create-payment.dto";
export * from "./payments/dto/payment-method.dto";
export * from "./payments/dto/payment-response.dto";
export * from "./payments/dto/process-payment.dto";
export * from "./payments/dto/refund-payment.dto";
export * from "./payments/interfaces/payment-provider.interface";
export * from "./payments/interfaces/payment.interface";
export * from "./payments/interfaces/transaction.interface";
export * from "./payments/payments.controller";
export * from "./payments/payments.module";
export * from "./payments/payments.resolver";
export * from "./payments/payments.service";
export * from "./payments/providers/payment-factory";
export * from "./payments/providers/paypal.provider";
export * from "./payments/providers/stripe.provider";
export * from "./payments/repositories/payment-method.repository";
export * from "./payments/repositories/payment.repository";
export * from "./payments/repositories/transaction.repository";

// Subscriptions
export * from "./subscriptions/constants/plan-limits.constants";
export * from "./subscriptions/dto/change-plan.dto";
export * from "./subscriptions/dto/create-subscription.dto";
export * from "./subscriptions/dto/plan-response.dto";
export * from "./subscriptions/dto/subscription-response.dto";
export * from "./subscriptions/dto/update-subscription.dto";
export * from "./subscriptions/interfaces/feature.interface";
export * from "./subscriptions/interfaces/plan.interface";
export * from "./subscriptions/interfaces/subscription.interface";
export * from "./subscriptions/repositories/plan.repository";
export * from "./subscriptions/repositories/subscription.repository";
export * from "./subscriptions/subscriptions.controller";
export * from "./subscriptions/subscriptions.module";
export * from "./subscriptions/subscriptions.resolver";
export * from "./subscriptions/subscriptions.service";

// Notifications
export * from "./notifications/dto/notification-template.dto";
export * from "./notifications/dto/send-notification.dto";
export * from "./notifications/interfaces/email-options.interface";
export * from "./notifications/interfaces/notification-provider.interface";
export * from "./notifications/interfaces/notification.interface";
export * from "./notifications/interfaces/sms-options.interface";
export * from "./notifications/notifications.controller";
export * from "./notifications/notifications.module";
export * from "./notifications/notifications.service";
export * from "./notifications/providers/email.provider";
export * from "./notifications/providers/notification-factory";
export * from "./notifications/providers/push.provider";
export * from "./notifications/providers/sms.provider";
export * from "./notifications/repositories/notification.repository";

// Websites
export * from "./websites/dto/create-website.dto";
export * from "./websites/dto/custom-domain.dto";
export * from "./websites/dto/page.dto";
export * from "./websites/dto/theme-settings.dto";
export * from "./websites/dto/update-website.dto";
export * from "./websites/dto/website-response.dto";
export * from "./websites/interfaces/custom-domain.interface";
export * from "./websites/interfaces/page.interface";
export * from "./websites/interfaces/theme.interface";
export * from "./websites/interfaces/website.interface";
export * from "./websites/repositories/custom-domain.repository";
export * from "./websites/repositories/page.repository";
export * from "./websites/repositories/theme.repository";
export * from "./websites/repositories/website-theme.repository";
export * from "./websites/repositories/website.repository";
export * from "./websites/templates/template-processor";
export * from "./websites/websites.controller";
export * from "./websites/websites.module";
export * from "./websites/websites.service";

// Reports
export * from "./reports/generators/appointment-report";
export * from "./reports/generators/client-report";
export * from "./reports/generators/excel-generator";
export * from "./reports/generators/pdf-generator";
export * from "./reports/generators/revenue-report";
export * from "./reports/generators/staff-performance";
export * from "./reports/reports.controller";
export * from "./reports/reports.module";
export * from "./reports/reports.service";
export * from "./reports/repositories/report.repository";
