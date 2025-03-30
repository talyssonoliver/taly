import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

/**
 * Generate a package dependency overview across workspaces
 */
async function generatePackageOverview() {
	console.log("Generating package dependency overview...");

	// Read root package.json
	const rootPackageJson = JSON.parse(
		await fs.readFile(path.join(rootDir, "package.json"), "utf8"),
	);

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

	console.log(`Found ${packageJsonFiles.length} package.json files`);

	// Collect dependencies
	const dependencies = {};
	const packagePaths = {};

	// Add root dependencies
	for (const depType of ["dependencies", "devDependencies"]) {
		if (rootPackageJson[depType]) {
			for (const [pkg, version] of Object.entries(rootPackageJson[depType])) {
				if (!dependencies[pkg]) {
					dependencies[pkg] = {};
				}
				dependencies[pkg].root = version;
				packagePaths[pkg] = packagePaths[pkg] || [];
				packagePaths[pkg].push("root");
			}
		}
	}

	// Add workspace dependencies
	for (const filePath of packageJsonFiles) {
		try {
			const packageJson = JSON.parse(await fs.readFile(filePath, "utf8"));
			const packageName = packageJson.name || path.relative(rootDir, filePath);

			for (const depType of [
				"dependencies",
				"devDependencies",
				"peerDependencies",
			]) {
				if (packageJson[depType]) {
					for (const [pkg, version] of Object.entries(packageJson[depType])) {
						if (!dependencies[pkg]) {
							dependencies[pkg] = {};
						}
						dependencies[pkg][packageName] = version;
						packagePaths[pkg] = packagePaths[pkg] || [];
						packagePaths[pkg].push(packageName);
					}
				}
			}
		} catch (e) {
			console.error(`Error processing ${filePath}:`, e);
		}
	}

	// Check for version inconsistencies
	const duplicates = [];
	const overrides = rootPackageJson?.pnpm?.overrides || {};

	for (const [pkg, versions] of Object.entries(dependencies)) {
		const uniqueVersions = new Set(Object.values(versions));

		if (uniqueVersions.size > 1 && !overrides[pkg]) {
			duplicates.push({
				package: pkg,
				versions,
				projects: packagePaths[pkg],
			});
		}
	}

	// Generate report
	let reportContent = `# Package Dependency Overview\n\n`;
	reportContent += `Generated on ${new Date().toLocaleDateString()}\n\n`;

	if (duplicates.length > 0) {
		reportContent += `## Version Inconsistencies\n\n`;
		reportContent += `The following packages have different versions across projects:\n\n`;

		for (const duplicate of duplicates) {
			reportContent += `### ${duplicate.package}\n\n`;
			for (const [project, version] of Object.entries(duplicate.versions)) {
				reportContent += `- ${project}: ${version}\n`;
			}
			reportContent += `\n**Recommendation:** Add to pnpm.overrides to ensure consistent versions\n\n`;
			reportContent += `\`\`\`json\n"${duplicate.package}": "${Object.values(duplicate.versions)[0]}"\n\`\`\`\n\n`;
		}
	}

	// Count dependency types
	const dependencyTypes = {
		total: Object.keys(dependencies).length,
		production: 0,
		development: 0,
		peer: 0,
	};

	for (const [pkg, versions] of Object.entries(dependencies)) {
		if (rootPackageJson.dependencies && rootPackageJson.dependencies[pkg]) {
			dependencyTypes.production++;
		} else if (
			rootPackageJson.devDependencies &&
			rootPackageJson.devDependencies[pkg]
		) {
			dependencyTypes.development++;
		}

		// Check if it appears as a peer dependency in any workspace
		for (const filePath of packageJsonFiles) {
			try {
				const packageJson = JSON.parse(await fs.readFile(filePath, "utf8"));
				if (packageJson.peerDependencies && packageJson.peerDependencies[pkg]) {
					dependencyTypes.peer++;
					break;
				}
			} catch {
				// Skip errors
			}
		}
	}

	reportContent += `## Dependency Statistics\n\n`;
	reportContent += `- Total Dependencies: ${dependencyTypes.total}\n`;
	reportContent += `- Production Dependencies: ${dependencyTypes.production}\n`;
	reportContent += `- Development Dependencies: ${dependencyTypes.development}\n`;
	reportContent += `- Peer Dependencies: ${dependencyTypes.peer}\n\n`;

	reportContent += `## Version Recommendations\n\n`;
	reportContent += `If you need to update dependencies across all packages, consider:\n\n`;
	reportContent += `1. Add entries to the \`pnpm.overrides\` section in root package.json\n`;
	reportContent += `2. Run \`pnpm update\` to apply overrides to all packages\n`;
	reportContent += `3. Use \`pnpm run update-deps:interactive\` for interactive updates\n`;

	// Write report to file
	const reportPath = path.join(rootDir, "dependency-overview.md");
	await fs.writeFile(reportPath, reportContent, "utf8");
	console.log(
		`Package overview report generated at: ${path.relative(rootDir, reportPath)}`,
	);
}

generatePackageOverview().catch(console.error);
