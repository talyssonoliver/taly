import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { ScheduleModule } from "@nestjs/schedule";
import type { Request } from "express";

// Controllers and services
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

// Configuration
import { appConfig } from "./config/app.config";
import { databaseConfig } from "./config/database.config";
import { jwtConfig } from "./config/jwt.config";
import { mailConfig } from "./config/mail.config";
import { stripeConfig } from "./config/stripe.config";
import { awsConfig } from "./config/aws.config";
import { redisConfig } from "./config/redis.config";
import { smsConfig } from "./config/sms.config";

// Database
import { PrismaModule } from "./database/prisma.module";

// Feature modules
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { SalonsModule } from "./salons/salons.module";
import { AppointmentsModule } from "./appointments/appointments.module";
import { ClientsModule } from "./clients/clients.module";
import { PaymentsModule } from "./payments/payments.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { WebsitesModule } from "./websites/websites.module";
import { ReportsModule } from "./reports/reports.module";
import { MailModule } from "./mail/mail.module";

// Guards
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { CustomThrottlerGuard } from "./common/guards/throttler.guard";

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
		ThrottlerModule.forRoot([
			{
				ttl: 60,
				limit: 100,
			},
		]),

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
			useClass: CustomThrottlerGuard,
		},
	],
})
export class AppModule {}
