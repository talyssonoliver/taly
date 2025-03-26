import { Injectable, Logger } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import type { PrismaService } from "./database/prisma.service";

interface HealthStatus {
	status: "ok" | "error";
	version: string;
	environment: string;
	timestamp: string;
	database: {
		status: "ok" | "error";
		message?: string;
	};
	services: {
		[key: string]: {
			status: "ok" | "error" | "not_checked";
			message?: string;
		};
	};
}

interface SystemStats {
	users: {
		total: number;
		staff: number;
	};
	system: {
		uptime: number;
		memoryUsage: NodeJS.MemoryUsage;
		nodeVersion: string;
	};
}

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);
	private readonly appVersion: string = "1.0.0"; // This should be dynamically pulled from package.json

	constructor(
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
	) {}

	/**
	 * Simple hello endpoint for basic API verification
	 */
	getHello(): string {
		return "Hello from Taly API!";
	}

	/**
	 * Get application version information
	 */
	getVersion(): { version: string; environment: string } {
		return {
			version: this.appVersion,
			environment: this.configService.get<string>("NODE_ENV", "development"),
		};
	}

	/**
	 * Comprehensive health check for the entire application
	 */
	async checkHealth(): Promise<HealthStatus> {
		const health: HealthStatus = {
			status: "ok",
			version: this.appVersion,
			environment: this.configService.get<string>("NODE_ENV", "development"),
			timestamp: new Date().toISOString(),
			database: {
				status: "ok",
			},
			services: {
				email: { status: "not_checked" },
				redis: { status: "not_checked" },
				stripe: { status: "not_checked" },
				aws: { status: "not_checked" },
			},
		};

		// Check database connection
		try {
			await this.prismaService.$queryRaw`SELECT 1`;
		} catch (error) {
			health.status = "error";
			health.database = {
				status: "error",
				message: `Database connection failed: ${(error as Error).message}`,
			};
			this.logger.error(
				"Health check - Database connection failed",
				(error as Error).stack,
			);
		}

		// Additional service checks could be added here
		// These would check Redis, email service, Stripe, etc.

		return health;
	}

	/**
	 * Get system statistics (could be expanded with more metrics)
	 */
	async getSystemStats(): Promise<SystemStats> {
		const userCount = await this.prismaService.user.count();
		const staffCount = await this.prismaService.staff.count();

		return {
			users: {
				total: userCount,
				staff: staffCount,
			},
			system: {
				uptime: process.uptime(),
				memoryUsage: process.memoryUsage(),
				nodeVersion: process.version,
			},
		};
	}
}