import { readdirSync } from "node:fs";
import * as path from "node:path";
import { PrismaClient } from "@prisma/client";
import { Logger } from "@nestjs/common";

const prisma = new PrismaClient();
const logger = new Logger("MigrationRunner");

async function runMigrations() {
	const migrationsDir = __dirname;
	const migrationFiles = readdirSync(migrationsDir)
		.filter((file) => file.endsWith(".js") && file !== "migration-runner.js")
		.sort(); 

	logger.log(`Found ${migrationFiles.length} migration files`);

	for (const migrationFile of migrationFiles) {
		logger.log(`Running migration: ${migrationFile}`);

		try {
			const migrationPath = path.join(migrationsDir, migrationFile);
			const migration = await import(migrationPath);

			if (migration && typeof migration.main === "function") {
				await prisma.$transaction(async (prismaTx) => {
					await migration.main(prismaTx);
				});
				logger.log(`Successfully executed migration: ${migrationFile}`);
			} else {
				throw new Error(
					`Migration ${migrationFile} does not export a 'main' function.`,
				);
			}
		} catch (error) {
			logger.error(`Error executing migration ${migrationFile}:`, error);
			throw error;
		}
	}
}

runMigrations()
	.catch((e) => {
		logger.error("Migration runner failed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
