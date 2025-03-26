import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import type { Request } from "express";

// Controllers and services
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

// Configuration
import { appConfig } from "./config/app.config";
import { awsConfig } from "./config/aws.config";
import { databaseConfig } from "./config/database.config";
import { jwtConfig } from "./config/jwt.config";
import { mailConfig } from "./config/mail.config";
import { redisConfig } from "./config/redis.config";
import { smsConfig } from "./config/sms.config";
import { stripeConfig } from "./config/stripe.config";

// Database
import { PrismaModule } from "./database/prisma.module";

import { AppointmentsModule } from "./appointments/appointments.module";
// Feature modules
import { AuthModule } from "./auth/auth.module";
import { ClientsModule } from "./clients/clients.module";
import { SalonsModule } from "./companies/salons.module";
import { MailModule } from "./mail/mail.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { PaymentsModule } from "./payments/payments.module";
import { ReportsModule } from "./reports/reports.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import { UsersModule } from "./users/users.module";
import { WebsitesModule } from "./websites/websites.module";

// Guards
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";

// Filters and Interceptors
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";

@Module({
	imports: [
		// Config
		ConfigModule.forRoot({
			isGlobal: true,
			load: [
				appConfig,
				databaseConfig,
				jwtConfig,
				mailConfig,
				stripeConfig,
				awsConfig,
				redisConfig,
				smsConfig,
			],
		}),

		// Rate limiting
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => [
				{
					ttl: configService.get<number>("THROTTLE_TTL", 60),
					limit: configService.get<number>("THROTTLE_LIMIT", 100),
				},
			],
		}),

		// GraphQL
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: true,
			sortSchema: true,
			playground: process.env.NODE_ENV !== "production",
			context: ({ req }: { req: Request }) => ({ req }),
		}),

		// Scheduling (for reminders, reports, etc.)
		ScheduleModule.forRoot(),

		// Database
		PrismaModule,

		// Feature modules
		AuthModule,
		UsersModule,
		SalonsModule,
		AppointmentsModule,
		ClientsModule,
		PaymentsModule,
		SubscriptionsModule,
		NotificationsModule,
		WebsitesModule,
		ReportsModule,
		MailModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		// Global pipes
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				transform: true,
				whitelist: true,
				forbidNonWhitelisted: true,
				transformOptions: {
					enableImplicitConversion: false,
				},
			}),
		},
		// Global filters
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
		// Global interceptors
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor,
		},
		// Global guards
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
