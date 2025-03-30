import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

/**
 * Fixes ESM imports in Next.js configuration files
 */
async function fixEsmPaths() {
	console.log("Fixing ESM paths in Next.js configuration files...");

	// Find all next.config.js files
	const nextConfigFiles = [];

	// Search in apps directory
	const appsDir = path.join(rootDir, "apps");
	try {
		const apps = await fs.readdir(appsDir);
		for (const app of apps) {
			const nextConfigPath = path.join(appsDir, app, "next.config.js");
			try {
				await fs.access(nextConfigPath);
				nextConfigFiles.push(nextConfigPath);
			} catch (e) {
				// File doesn't exist, skip
			}
		}
	} catch (e) {
		console.error(`Error reading apps directory: ${e.message}`);
	}

	console.log(
		`Found ${nextConfigFiles.length} Next.js config files to process`,
	);

	// Update each next.config.js file to use ESM compatible __dirname
	for (const configFile of nextConfigFiles) {
		try {
			const content = await fs.readFile(configFile, "utf8");

			// Check if file needs to be updated
			if (content.includes("__dirname") && !content.includes("fileURLToPath")) {
				// Convert CommonJS to ESM
				const updatedContent = `import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

${content.replace(/const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\)/g, 'import $1 from "$2"')}`;

				await fs.writeFile(configFile, updatedContent, "utf8");
				console.log(`Updated: ${path.relative(rootDir, configFile)}`);
			} else {
				console.log(
					`No changes needed in: ${path.relative(rootDir, configFile)}`,
				);
			}
		} catch (e) {
			console.error(`Error processing ${configFile}: ${e.message}`);
		}
	}

	console.log("ESM path fixing complete");
}

fixEsmPaths().catch(console.error);
