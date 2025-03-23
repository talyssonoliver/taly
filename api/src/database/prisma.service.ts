import {
	type INestApplication,
	Injectable,
	Logger,
	type OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
import {
	CountQueryResult,
	ThemeCountParams,
	ThemeCreateParams,
	ThemeDeleteParams,
	ThemeFindManyParams,
	ThemeFindUniqueParams,
	ThemeModel,
	ThemeUpdateParams,
	WebsiteThemeRecord,
} from "../websites/types/theme.types";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	private readonly logger = new Logger(PrismaService.name);

	// Add the theme property to the class
	public readonly theme: ThemeModel;

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

		// Initialize theme model using direct SQL queries
		this.theme = {
			findMany: async (args?: ThemeFindManyParams) => {
				// Using a basic query that should work with any schema
				const orderBy =
					args?.orderBy?.name === "asc" ? "ORDER BY name ASC" : "";
				const whereClause = args?.where
					? this.buildWhereClause(args.where)
					: "";

				const query = `SELECT * FROM "WebsiteTheme" ${whereClause} ${orderBy}`;
				return this.$queryRawUnsafe(query) as Promise<WebsiteThemeRecord[]>;
			},

			findUnique: async (args: ThemeFindUniqueParams) => {
				const result = await this.$queryRawUnsafe<WebsiteThemeRecord[]>(
					`SELECT * FROM "WebsiteTheme" WHERE id = $1 LIMIT 1`,
					args.where.id,
				);
				// Return null if no result (consistent with Prisma's behavior)
				return result.length > 0 ? result[0] : null;
			},

			create: async (args: ThemeCreateParams) => {
				const { fields, values, placeholders } = this.prepareInsertData(
					args.data,
				);

				const result = await this.$queryRawUnsafe<WebsiteThemeRecord[]>(
					`INSERT INTO "WebsiteTheme" (${fields}) VALUES (${placeholders}) RETURNING *`,
					...values,
				);
				return result[0];
			},

			update: async (args: ThemeUpdateParams) => {
				const { setClauses, values } = this.prepareUpdateData(args.data);

				// First value is the ID
				const allValues = [args.where.id, ...values];

				const result = await this.$queryRawUnsafe<WebsiteThemeRecord[]>(
					`UPDATE "WebsiteTheme" SET ${setClauses} WHERE id = $1 RETURNING *`,
					...allValues,
				);
				return result[0];
			},

			delete: async (args: ThemeDeleteParams) => {
				const result = await this.$queryRawUnsafe<WebsiteThemeRecord[]>(
					`DELETE FROM "WebsiteTheme" WHERE id = $1 RETURNING *`,
					args.where.id,
				);
				return result[0];
			},

			count: async (args?: ThemeCountParams) => {
				const whereClause = args?.where
					? this.buildWhereClause(args.where)
					: "";

				const result = await this.$queryRawUnsafe<CountQueryResult[]>(
					`SELECT COUNT(*) as count FROM "WebsiteTheme" ${whereClause}`,
				);

				return Number(result[0].count);
			},
		};
	}

	// Helper method to build SQL WHERE clause
	private buildWhereClause(where: Record<string, unknown>): string {
		if (!where || Object.keys(where).length === 0) {
			return "";
		}

		const conditions = Object.entries(where)
			.filter(([_, value]) => value !== undefined)
			.map(([key, _]) => `"${key}" = ?`)
			.join(" AND ");

		return conditions ? `WHERE ${conditions}` : "";
	}

	// Helper method to prepare data for INSERT
	private prepareInsertData(data: Record<string, unknown>): {
		fields: string;
		values: unknown[];
		placeholders: string;
	} {
		const entries = Object.entries(data).filter(([_, v]) => v !== undefined);
		const fields = entries.map(([k, _]) => `"${k}"`).join(", ");
		const values = entries.map(([_, v]) => v);
		const placeholders = entries.map((_, i) => `$${i + 1}`).join(", ");

		return { fields, values, placeholders };
	}

	// Helper method to prepare data for UPDATE
	private prepareUpdateData(data: Record<string, unknown>): {
		setClauses: string;
		values: unknown[];
	} {
		const entries = Object.entries(data).filter(([_, v]) => v !== undefined);
		const setClauses = entries
			.map(([k, _], i) => `"${k}" = $${i + 2}`)
			.join(", ");
		const values = entries.map(([_, v]) => v);

		return { setClauses, values };
	}

	async onModuleInit() {
		this.logger.log("Connecting to Prisma...");

		try {
			await this.$connect();
			this.logger.log("Successfully connected to Prisma");

			this.$extends({
				query: {
					$allModels: {
						async $allOperations({ model, operation, args, query }) {
							const before = Date.now();
							const result = await query(args);
							const after = Date.now();

							this.logger.debug(
								`Query ${model}.${operation} took ${after - before}ms`,
							);

							return result;
						},
					},
				},
			});
		} catch (error) {
			this.logger.error(`Failed to connect to Prisma: ${error.message}`);
			throw error;
		}
	}

	async enableShutdownHooks(app: INestApplication) {
		// Use proper type for PrismaClient which has the $on method
		(
			this as unknown as {
				$on: (event: string, callback: () => Promise<void>) => void;
			}
		).$on("beforeExit", async () => {
			this.logger.log("Disconnecting from Prisma...");
			await app.close();
		});
	}

	async cleanDatabase() {
		if (this.configService.get<string>("NODE_ENV") === "production") {
			throw new Error("Database cleaning is not allowed in production");
		}

		this.logger.warn("Cleaning database for testing purposes");

		const modelKeys = Object.keys(this).filter((key) => {
			return (
				!key.startsWith("_") &&
				typeof this[key as keyof this] === "object" &&
				this[key as keyof this] !== null &&
				typeof (this[key as keyof this] as { deleteMany?: unknown })
					.deleteMany === "function"
			);
		});

		// Delete data from all tables
		return Promise.all(
			modelKeys.map(async (modelKey) => {
				const model = this[modelKey as keyof this] as {
					deleteMany: (args: Record<string, unknown>) => Promise<unknown>;
				};
				await model.deleteMany({});
			}),
		);
	}
}
