import {
	type INestApplication,
	Injectable,
	type OnModuleInit,
	Logger,
} from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	private readonly logger = new Logger(PrismaService.name);

	constructor(private configService: ConfigService) {
		super({
			datasources: {
				db: {
					url: configService.get<string>("DATABASE_URL"),
				},
			},
			log:
				configService.get<string>("NODE_ENV") === "development"
					? ["query", "info", "warn", "error"]
					: ["error"],
		});
	}

	async onModuleInit() {
		this.logger.log("Connecting to Prisma...");

		try {
			await this.$connect();
			this.logger.log("Successfully connected to Prisma");

			// Add middleware for logging
			this.$use(async (params, next) => {
				const before = Date.now();
				const result = await next(params);
				const after = Date.now();

				this.logger.debug(
					`Query ${params.model}.${params.action} took ${after - before}ms`,
				);

				return result;
			});
		} catch (error) {
			this.logger.error(`Failed to connect to Prisma: ${error.message}`);
			throw error;
		}
	}

	async enableShutdownHooks(app: INestApplication) {
		this.$on("beforeExit", async () => {
			this.logger.log("Disconnecting from Prisma...");
			await app.close();
		});
	}

	async cleanDatabase() {
		if (this.configService.get<string>("NODE_ENV") === "production") {
			throw new Error("Database cleaning is not allowed in production");
		}

		this.logger.warn("Cleaning database for testing purposes");

		// Get all table names from Prisma schema
		const models = Reflect.ownKeys(this).filter((key) => {
			return (
				!key.toString().startsWith("_") &&
				typeof this[key] === "object" &&
				this[key] !== null &&
				"deleteMany" in this[key]
			);
		});

		// Delete data from all tables
		return Promise.all(
			models.map(async (modelKey) => {
				const model = this[modelKey.toString()];
				await model.deleteMany({});
			}),
		);
	}
}
