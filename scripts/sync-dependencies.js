import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

/**
 * Synchronizes workspace package.json files with root overrides
 */
async function syncDependencies() {
	// Read root package.json to get overrides
	const rootPackageJson = JSON.parse(
		await fs.readFile(path.join(rootDir, "package.json"), "utf8"),
	);

	const overrides = rootPackageJson?.pnpm?.overrides || {};

	if (Object.keys(overrides).length === 0) {
		console.log("No overrides found in root package.json");
		return;
	}

	// Find all package.json files in workspaces
	const workspaces = rootPackageJson.workspaces || [];
	const packageJsonFiles = [];

	for (const workspace of workspaces) {
		if (workspace.includes("*")) {
			// Handle glob patterns
			const basePath = workspace.replace("/*", "");
			const dirs = await fs.readdir(path.join(rootDir, basePath));
			for (const dir of dirs) {
				const packageJsonPath = path.join(
					rootDir,
					basePath,
					dir,
					"package.json",
				);
				try {
					await fs.access(packageJsonPath);
					packageJsonFiles.push(packageJsonPath);
				} catch (e) {
					// File doesn't exist, skip
				}
			}
		} else {
			// Direct path
			const packageJsonPath = path.join(rootDir, workspace, "package.json");
			try {
				await fs.access(packageJsonPath);
				packageJsonFiles.push(packageJsonPath);
			} catch (e) {
				// File doesn't exist, skip
			}
		}
	}

	console.log(`Found ${packageJsonFiles.length} package.json files to process`);

	// Update each package.json file
	for (const filePath of packageJsonFiles) {
		try {
			const packageJson = JSON.parse(await fs.readFile(filePath, "utf8"));

			// Remove explicit peerDependencies for overridden packages
			if (packageJson.peerDependencies) {
				let modified = false;

				for (const dep in packageJson.peerDependencies) {
					if (overrides[dep]) {
						delete packageJson.peerDependencies[dep];
						modified = true;
					}
				}

				// Remove peerDependencies section if empty
				if (Object.keys(packageJson.peerDependencies).length === 0) {
					delete packageJson.peerDependencies;
					modified = true;
				}

				if (modified) {
					await fs.writeFile(
						filePath,
						JSON.stringify(packageJson, null, 2),
						"utf8",
					);
					console.log(`Updated ${path.relative(rootDir, filePath)}`);
				}
			}
		} catch (e) {
			console.error(`Error processing ${filePath}:`, e);
		}
	}

	console.log("Dependency synchronization complete");
}

syncDependencies().catch(console.error);
