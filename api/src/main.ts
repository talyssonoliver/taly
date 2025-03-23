import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import compression from "compression";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { PrismaExceptionFilter } from "./common/filters/prisma-exception.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { TimeoutInterceptor } from "./common/interceptors/timeout.interceptor";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";

async function bootstrap() {
	const logger = new Logger("Bootstrap");
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	// Set API global prefix
	app.setGlobalPrefix("api");

	// Enable CORS
	app.enableCors({
		origin: configService.get<string>("CORS_ORIGINS") || "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
	});

	// Apply security middleware
	app.use(helmet());

	// Compression
	app.use(compression());

	// Apply global pipes, filters, and interceptors
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	);

	app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

	app.useGlobalInterceptors(
		new TransformInterceptor(),
		new TimeoutInterceptor(
			configService.get<number>("REQUEST_TIMEOUT") ?? 60000,
		),
		new LoggingInterceptor(),
	);

	// Setup Swagger documentation
	if (
		["development", "staging"].includes(
			configService.get<string>("NODE_ENV") || "production",
		)
	) {
		const swaggerConfig = new DocumentBuilder()
			.setTitle("Salon CRM API")
			.setDescription(
				"The Salon CRM API provides endpoints for managing salon appointments, clients, services, and more",
			)
			.setVersion("1.0")
			.addBearerAuth(
				{ type: "http", scheme: "bearer", bearerFormat: "JWT" },
				"access-token",
			)
			.addTag("auth", "Authentication endpoints")
			.addTag("users", "User management endpoints")
			.addTag("salons", "Salon management endpoints")
			.addTag("services", "Service management endpoints")
			.addTag("appointments", "Appointment management endpoints")
			.addTag("clients", "Client management endpoints")
			.addTag("payments", "Payment management endpoints")
			.addTag("subscriptions", "Subscription management endpoints")
			.addTag("websites", "Website management endpoints")
			.build();

		const document = SwaggerModule.createDocument(app, swaggerConfig);
		SwaggerModule.setup("api/docs", app, document, {
			swaggerOptions: {
				persistAuthorization: true,
			},
		});

		logger.log("Swagger documentation initialized at /api/docs");
	}

	// Start the server
	const port = configService.get("PORT", 3000);
	await app.listen(port);
	logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch((error) => {
	new Logger("Bootstrap").error(`Failed to start application: ${error}`);
});
