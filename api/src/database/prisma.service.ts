import {
	type INestApplication,
	Injectable,
	Logger,
	OnModuleDestroy,
	type OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client/extension";
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

// Define query event type for proper typing
interface QueryEvent {
	query: string;
	params: string;
	duration: number;
	target: string;
}

// Define type for $allOperations parameters
interface OperationParams {
	model: string;
	operation: string;
	args: Record<string, unknown>;
	query: (args: Record<string, unknown>) => Promise<unknown>;
}

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
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
				const result = await this.$queryRawUnsafe(
					`SELECT * FROM "WebsiteTheme" WHERE id = $1 LIMIT 1`,
					args.where.id,
				) as WebsiteThemeRecord[];
				// Return null if no result (consistent with Prisma's behavior)
				return result.length > 0 ? result[0] : null;
			},

			create: async (args: ThemeCreateParams) => {
				const { fields, values, placeholders } = this.prepareInsertData(
					args.data,
				);

				const result = await this.$queryRawUnsafe(
					`INSERT INTO "WebsiteTheme" (${fields}) VALUES (${placeholders}) RETURNING *`,
					...values,
				) as WebsiteThemeRecord[];
				return result[0];
			},

			update: async (args: ThemeUpdateParams) => {
				const { setClauses, values } = this.prepareUpdateData(args.data);

				// First value is the ID
				const allValues = [args.where.id, ...values];

				const result = await this.$queryRawUnsafe(
					`UPDATE "WebsiteTheme" SET ${setClauses} WHERE id = $1 RETURNING *`,
					...allValues,
				) as WebsiteThemeRecord[];
				return result[0];
			},

			delete: async (args: ThemeDeleteParams) => {
				const result = await this.$queryRawUnsafe(
					`DELETE FROM "WebsiteTheme" WHERE id = $1 RETURNING *`,
					args.where.id,
				) as WebsiteThemeRecord[];
				return result[0];
			},

			count: async (args?: ThemeCountParams) => {
				const whereClause = args?.where
					? this.buildWhereClause(args.where)
					: "";

				const result = await this.$queryRawUnsafe(
					`SELECT COUNT(*) as count FROM "WebsiteTheme" ${whereClause}`,
				) as CountQueryResult[];

				return Number(result[0].count);
			},
		};

		// Log queries in development environment
		if (process.env.NODE_ENV === "development") {
			this.$on("query" as never, (e: QueryEvent) => {
				this.logger.debug(`Query: ${e.query}`);
				this.logger.debug(`Duration: ${e.duration}ms`);
			});
		}
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

			const self = this;
			this.$extends({
				query: {
					$allModels: {
						async $allOperations({ model, operation, args, query }: OperationParams) {
							const before = Date.now();
							const result = await query(args);
							const after = Date.now();

							self.logger.debug(
								`Query ${model}.${operation} took ${after - before}ms`,
							);

							return result;
						},
					},
				},
			});
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			this.logger.error(`Failed to connect to Prisma: ${errorMessage}`);
			throw error;
		}
	}

	async onModuleDestroy() {
		try {
			this.logger.log("Disconnecting from database...");
			await this.$disconnect();
			this.logger.log("Successfully disconnected from database");
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			this.logger.error(`Error disconnecting from database: ${errorMessage}`);
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

	async getAllThemes(): Promise<WebsiteThemeRecord[]> {
		const query = `SELECT * FROM themes`;
		return this.$queryRawUnsafe(query) as Promise<WebsiteThemeRecord[]>;
	}

	async getThemesBySearch(search: string): Promise<WebsiteThemeRecord[]> {
		const result = await this.$queryRawUnsafe(
			`SELECT * FROM themes WHERE name ILIKE $1`,
			`%${search}%`
		) as WebsiteThemeRecord[];

		return result;
	}

	async getThemesBySearchAndSort(search: string, sort: string): Promise<WebsiteThemeRecord[]> {
		const result = await this.$queryRawUnsafe(
			`SELECT * FROM themes WHERE name ILIKE $1 ORDER BY ${sort}`,
			`%${search}%`
		) as WebsiteThemeRecord[];

		return result;
	}

	async getThemesByIDs(ids: string[]): Promise<WebsiteThemeRecord[]> {
		const result = await this.$queryRawUnsafe(
			`SELECT * FROM themes WHERE id = ANY($1)`,
			ids
		) as WebsiteThemeRecord[];

		return result;
	}

	async getThemesWithPagination(limit: number, page: number): Promise<WebsiteThemeRecord[]> {
		const result = await this.$queryRawUnsafe(
			`SELECT * FROM themes LIMIT $1 OFFSET $2`,
			limit,
			(page - 1) * limit
		) as WebsiteThemeRecord[];

		return result;
	}

	async countThemes(): Promise<number> {
		const result = await this.$queryRawUnsafe(
			`SELECT COUNT(*) as count FROM themes`
		) as CountQueryResult[];

		return Number(result[0].count);
	}
}
