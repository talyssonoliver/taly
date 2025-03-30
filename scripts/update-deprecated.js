import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import readline from "readline";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

/**
 * Fetch package information from npm registry
 */
async function getPackageInfo(packageName) {
	return new Promise((resolve, reject) => {
		https
			.get(`https://registry.npmjs.org/${packageName}`, (res) => {
				let data = "";

				res.on("data", (chunk) => {
					data += chunk;
				});

				res.on("end", () => {
					try {
						if (res.statusCode === 200) {
							resolve(JSON.parse(data));
						} else {
							resolve(null);
						}
					} catch (e) {
						reject(e);
					}
				});
			})
			.on("error", (err) => {
				reject(err);
			});
	});
}

/**
 * Create a readline interface for user interaction
 */
function createPrompt() {
	return readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
}

/**
 * Ask a yes/no question
 */
async function askQuestion(rl, question) {
	return new Promise((resolve) => {
		rl.question(`${question} (y/n): `, (answer) => {
			resolve(answer.toLowerCase().startsWith("y"));
		});
	});
}

/**
 * Updates deprecated dependencies in workspace package.json files
 */
async function updateDeprecatedDependencies() {
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

	console.log(`Found ${packageJsonFiles.length} package.json files to process`);

	// Define deprecated packages and their replacements
	const deprecatedPackages = {
		"@babel/polyfill": "@babel/preset-env",
		request: "node-fetch",
		"uuid/v4": "uuid",
		"gulp-util": "gulp-replace",
		"merge-stream": "stream-combiner2",
		tslint: "eslint",
		"node-sass": "sass",
		"react-addons-css-transition-group": "react-transition-group",
		moment: "date-fns",
		"core-js@2": "core-js@3",
		"left-pad": "String.prototype.padStart",
		"rollup-plugin-babel": "@rollup/plugin-babel",
		enzyme: "@testing-library/react",
		"extract-text-webpack-plugin": "mini-css-extract-plugin",
		"uglify-js": "terser",
	};

	// Packages to check for major version updates
	const checkForUpdates = [
		"react",
		"react-dom",
		"typescript",
		"webpack",
		"babel",
		"eslint",
		"jest",
		"lodash",
		"express",
		"next",
	];

	// Migration guides for major updates
	const migrationGuides = {
		react: {
			19: "https://react.dev/blog/2024/04/25/react-19",
			18: "https://react.dev/blog/2022/03/29/react-v18",
		},
		jest: {
			29: "https://jestjs.io/docs/29.0/upgrading-to-jest29",
			28: "https://jestjs.io/docs/28.0/upgrading-to-jest28",
		},
		typescript: {
			5: "https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/",
			4: "https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/",
		},
	};

	// Check if interactive mode is enabled
	const isInteractive =
		process.argv.includes("--interactive") || process.argv.includes("-i");
	let rl;

	if (isInteractive) {
		rl = createPrompt();
		console.log(
			"Running in interactive mode. You'll be prompted for each update.",
		);
	}

	// Update each package.json file
	let updatedCount = 0;
	let outdatedPackagesCount = 0;
	const outdatedPackages = {};
	const packagesToUpdate = {};

	for (const filePath of packageJsonFiles) {
		try {
			const packageJson = JSON.parse(await fs.readFile(filePath, "utf8"));
			let modified = false;
			const relativeFilePath = path.relative(rootDir, filePath);

			// Check and update deprecated dependencies
			for (const depType of [
				"dependencies",
				"devDependencies",
				"peerDependencies",
			]) {
				if (packageJson[depType]) {
					// Handle deprecated packages
					for (const [oldPkg, newPkg] of Object.entries(deprecatedPackages)) {
						if (packageJson[depType][oldPkg]) {
							const version = packageJson[depType][oldPkg];

							let shouldUpdate = true;
							if (isInteractive) {
								shouldUpdate = await askQuestion(
									rl,
									`Replace ${oldPkg} with ${newPkg} in ${relativeFilePath}?`,
								);
							}

							if (shouldUpdate) {
								console.log(
									`Replacing ${oldPkg} with ${newPkg} in ${relativeFilePath}`,
								);
								delete packageJson[depType][oldPkg];
								packageJson[depType][newPkg] = version;
								modified = true;
							}
						}
					}

					// Check for major outdated packages
					for (const [pkg, version] of Object.entries(packageJson[depType])) {
						const normalizedVersion = version.replace(/[\^~>=<]/g, "");

						// Check if this package should be evaluated for updates
						const shouldCheck = checkForUpdates.some(
							(name) =>
								pkg === name ||
								pkg.startsWith(`${name}/`) ||
								pkg.startsWith(`@${name}/`),
						);

						if (shouldCheck) {
							try {
								const pkgInfo = await getPackageInfo(pkg);
								if (
									pkgInfo &&
									pkgInfo["dist-tags"] &&
									pkgInfo["dist-tags"].latest
								) {
									const latestVersion = pkgInfo["dist-tags"].latest;
									const currentMajor = parseInt(
										normalizedVersion.split(".")[0],
										10,
									);
									const latestMajor = parseInt(latestVersion.split(".")[0], 10);

									if (
										!isNaN(currentMajor) &&
										!isNaN(latestMajor) &&
										latestMajor > currentMajor
									) {
										console.log(
											`[OUTDATED] ${pkg} in ${relativeFilePath}: current=${normalizedVersion}, latest=${latestVersion}`,
										);

										// Record outdated package info for report
										if (!outdatedPackages[pkg]) {
											outdatedPackages[pkg] = {
												current: currentMajor,
												latest: latestMajor,
												files: [],
											};
										}
										outdatedPackages[pkg].files.push({
											path: relativeFilePath,
											exactVersion: normalizedVersion,
											depType,
										});

										// Ask if user wants to update this package
										if (isInteractive) {
											const updateKey = `${pkg}|${relativeFilePath}`;
											if (!packagesToUpdate[updateKey]) {
												const shouldUpdate = await askQuestion(
													rl,
													`Update ${pkg} from v${normalizedVersion} to v${latestVersion} in ${relativeFilePath}?`,
												);
												packagesToUpdate[updateKey] = {
													shouldUpdate,
													pkg,
													filePath,
													depType,
													currentVersion: version,
													latestVersion,
												};
											}
										}

										outdatedPackagesCount++;
									}
								}
							} catch (e) {
								console.warn(
									`Couldn't check for updates on ${pkg}: ${e.message}`,
								);
							}
						}
					}
				}
			}

			if (modified) {
				await fs.writeFile(
					filePath,
					JSON.stringify(packageJson, null, 2),
					"utf8",
				);
				updatedCount++;
			}
		} catch (e) {
			console.error(`Error processing ${filePath}:`, e);
		}
	}

	// Apply updates for packages selected in interactive mode
	if (isInteractive && Object.keys(packagesToUpdate).length > 0) {
		console.log("\nApplying selected updates...");

		for (const [key, info] of Object.entries(packagesToUpdate)) {
			if (info.shouldUpdate) {
				try {
					const packageJson = JSON.parse(
						await fs.readFile(info.filePath, "utf8"),
					);

					if (
						packageJson[info.depType] &&
						packageJson[info.depType][info.pkg]
					) {
						// Preserve version prefix (^, ~, etc.)
						const prefix = info.currentVersion.startsWith("^")
							? "^"
							: info.currentVersion.startsWith("~")
								? "~"
								: "";

						packageJson[info.depType][info.pkg] =
							`${prefix}${info.latestVersion}`;

						await fs.writeFile(
							info.filePath,
							JSON.stringify(packageJson, null, 2),
							"utf8",
						);

						console.log(
							`Updated ${info.pkg} to ${info.latestVersion} in ${path.relative(rootDir, info.filePath)}`,
						);
						updatedCount++;
					}
				} catch (e) {
					console.error(`Error updating ${info.pkg} in ${info.filePath}:`, e);
				}
			}
		}
	}

	if (isInteractive) {
		rl.close();
	}

	console.log(`Updated ${updatedCount} package.json files`);
	if (outdatedPackagesCount > 0) {
		console.log(
			`Found ${outdatedPackagesCount} outdated major versions that could be updated manually`,
		);

		// Generate migration report
		await generateMigrationReport(outdatedPackages, migrationGuides);
	}
	console.log("Dependency update complete");
}

/**
 * Generate a migration report for outdated dependencies
 */
async function generateMigrationReport(outdatedPackages, migrationGuides) {
	let reportContent = `# Dependency Migration Report\n\n`;
	reportContent += `Generated on ${new Date().toLocaleDateString()}\n\n`;

	reportContent += `## Outdated Major Versions\n\n`;

	for (const [pkg, info] of Object.entries(outdatedPackages)) {
		reportContent += `### ${pkg}: v${info.current} → v${info.latest}\n\n`;

		// Add migration guide link if available
		if (migrationGuides[pkg] && migrationGuides[pkg][info.latest.toString()]) {
			reportContent += `Migration guide: [${pkg} v${info.latest} Migration](${migrationGuides[pkg][info.latest.toString()]})\n\n`;
		}

		// Add specific update instructions
		if (pkg === "react" || pkg === "react-dom") {
			reportContent += `**React 19 Migration Notes:**\n\n`;
			reportContent += `- Review the [React 19 release blog](https://react.dev/blog/2024/04/25/react-19)\n`;
			reportContent += `- Update both react and react-dom packages together\n`;
			reportContent += `- Check for deprecated lifecycle methods and update them\n`;
			reportContent += `- Test thoroughly with React Developer Tools\n\n`;
		} else if (pkg === "jest") {
			reportContent += `**Jest Migration Notes:**\n\n`;
			reportContent += `- Review the migration guide for breaking changes\n`;
			reportContent += `- Update test configurations in jest.config.js\n`;
			reportContent += `- Check for deprecated test APIs\n\n`;
		}

		// List affected files
		reportContent += `**Affected files:**\n\n`;
		info.files.forEach((file) => {
			reportContent += `- ${file.path} (current: ${file.exactVersion})\n`;
		});
		reportContent += `\n`;

		// Add update command
		reportContent += `**Update command:**\n\n`;
		reportContent += `\`\`\`bash\npnpm add ${pkg}@latest ${pkg === "react" ? "react-dom@latest" : ""}\n\`\`\`\n\n`;
	}

	reportContent += `## Update Strategy\n\n`;
	reportContent += `1. Create a dedicated branch for dependency updates\n`;
	reportContent += `2. Update one major package at a time\n`;
	reportContent += `3. Run tests after each update\n`;
	reportContent += `4. Fix breaking changes before moving to the next package\n`;

	// Write report to file
	const reportPath = path.join(rootDir, "migration-report.md");
	await fs.writeFile(reportPath, reportContent, "utf8");
	console.log(
		`Migration report generated at: ${path.relative(rootDir, reportPath)}`,
	);
}

updateDeprecatedDependencies().catch(console.error);
