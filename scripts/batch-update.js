import { execSync } from "child_process";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

/**
 * Create a readline interface for user interaction
 */
function createPrompt() {
	return readline.createInterface({
		input: process.stdin,
		output: process.stdout,,
	});
}

/**
 * Ask a multiple choice question
 */
async function askMultipleChoice(rl, question, choices) {
	return new Promise((resolve) => {
		console.log(`\n${question}`);
		choices.forEach((choice, index) => {
			console.log(`${index + 1}. ${choice}`);
		});

		rl.question("Enter your choice (number): ", (answer) => {
			const choice = Number.parseInt(answer.trim));
			if (!isNaN(choice) && choice >= 1 && choice <= choices.length) {
				resolve(choice);
			} else {
				console.log("Invalid choice. Please try again.");
				resolve(askMultipleChoice(rl, question, choices));
			}
		});
	});
}

/**
 * Group packages by category
 */
function groupPackagesByCategory(packages) {
	const groups = {
		react: [],
		nestjs: [],
		types: [],
		testing: [],
		aws: [],
		tools: [],
		other: [],,
	};

	for (const pkg of packages) {
		if (pkg.name.startsWith("react") || pkg.name.includes("/react")) {
			groups.react.push(pkg);
		} else if (pkg.name.includes("nestjs") || pkg.name.includes("@nestjs/")) {
			groups.nestjs.push(pkg);
		} else if (pkg.name.startsWith("@types/")) {
			groups.types.push(pkg);
		} else if (pkg.name.includes("jest") || pkg.name.includes("test")) {
			groups.testing.push(pkg);
		} else if (pkg.name.includes("aws")) {
			groups.aws.push(pkg);
		} else if (
			pkg.name.includes("eslint") ||
			pkg.name.includes("prettier") ||
			pkg.name.includes("lint") ||
			pkg.name.includes("typescript")
		) {
			groups.tools.push(pkg);
		} else {
			groups.other.push(pkg);
		}
	}

	return groups;
}

/**
 * Batch update script for dependencies
 */
async function batchUpdate() {
	console.log("🔍 Analyzing outdated dependencies...");

	// Get outdated packages
	let outdatedPackages = [];
	try {
		const stdout = execSync("pnpm outdated --json", { encoding: "utf8" });
		outdatedPackages = JSON.parse(stdout.trim());

		// Format the packages
		outdatedPackages = Object.entries(outdatedPackages).map(([name, info]) => ({
			name,
			current: info.current,
			latest: info.latest,
			type: info.dev ? "devDependency" : "dependency",
		}));
	} catch (error) {
		// Parse the output from stderr which is where pnpm puts the JSON with exit code 1
		if (error.stderr) {
			try {
				const jsonMatch = error.stderr.match(/\[\s*\{.*\}\s*\]/);
				if (jsonMatch) {
					const json = jsonMatch[0];
					outdatedPackages = JSON.parse(json);
				} else if (error.stdout) {
					// Try to parse the JSON from stdout
					outdatedPackages = JSON.parse(error.stdout.trim());
				}
			} catch (e) {
				console.error("Failed to parse outdated packages:", e);
			}
		}
	}

	// If still empty, try another format
	if (outdatedPackages.length === 0) {
		try {
			const stdout = execSync("pnpm outdated --format=json", {
				encoding: "utf8",
				stdio: "pipe",
			});
			outdatedPackages = JSON.parse(stdout);
		} catch (error) {
			console.log(
				"Could not get outdated packages in JSON format, continuing with manual process",
			);
		}
	}

	if (!Array.isArray(outdatedPackages) || outdatedPackages.length === 0) {
		// Manual parsing from the text output
		console.log("Parsing outdated packages manually...");

		const stdout = execSync("pnpm outdated", { encoding: "utf8" });
		const lines = stdout.trim().split("\n");

		// Skip header rows and parse package info
		for (let i = 3; i < lines.length; i++) {
			const line = lines[i].trim();
			if (line.startsWith("│")) {
				const parts = line.split("│").filter((p) => p.trim());
				if (parts.length >= 3) {
					const name = parts[0].trim();
					const current = parts[1].trim();
					const latest = parts[2].trim();
					const isDev = name.includes("(dev)");

					outdatedPackages.push({
						name: name.replace("(dev)", "").trim(),
						current,
						latest,
						type: isDev ? "devDependency" : "dependency",
					});
				}
			}
		}
	}

	if (outdatedPackages.length === 0) {
		console.log("No outdated packages found!");
		return;
	}

	console.log(`Found ${outdatedPackages.length} outdated packages`);

	// Group packages by category
	const packageGroups = groupPackagesByCategory(outdatedPackages);

	// Create prompt interface
	const rl = createPrompt();

	const categories = [
		{ name: "React & React DOM", key: "react" },
		{ name: "NestJS packages", key: "nestjs" },
		{ name: "TypeScript type definitions", key: "types" },
		{ name: "Testing libraries", key: "testing" },
		{ name: "AWS SDK packages", key: "aws" },
		{ name: "Development tools", key: "tools" },
		{ name: "Other packages", key: "other" },
		{ name: "All packages", key: "all" },
	];

	// Display menu
	console.log("\n🔄 Batch Update Dependencies\n");

	for (const category of categories) {
		const count =
			category.key === "all"
				? outdatedPackages.length
				: packageGroups[category.key]?.length || 0;
		console.log(`${category.name} (${count} packages)`);
	}

	const choice = await askMultipleChoice(
		rl,
		"Which group of packages would you like to update?",
		categories.map(
			(c) =>
				`${c.name} (${
					c.key === "all"
           
           
						? outdatedPackes.length
					 packageGroups[c.key]?.length || 0
				 packages)`,
	),
	);

// Get selected category
	const selectedCategory = ctegories[choice - 1];

	// Get packages to update
	let packagesToUpdate = [];
	if (selecedCategory.key === "all") {
		packagesToUpdate = outdatedPackages;
	} lse {
	packagesToUpdate = packageGroups[selectedCategory.key];
	}

	console.log(`\nSelected ${packagesToUpdate.length} packages for pdate:`);
	packgesToUpdate.forEach((pkg) => {
	console.log(`- ${pkg.name}: ${pkg.current} → ${pkg.latest}`);
	});

	const confirmed = await new Promise((resolve) => {
		rl.question(
			"\nDo you want to proceed with the update? y/n): ",
			(ansr) => {
				reolve(answer.toLowerCase() === "y");
			},
	);
	});

	if (!confirmed {
		console.lg("Update canceled");
		r.close();
	return;
	}

	console.log("\n🔄 Updating packages...";

// Extract package names with versions
	const ackageSpecs = packagesToUpdate.map((pkg) => `${pkg.name}@latest`);

	try {
		// Run pnpm add command with all packages
		console.log(`Running:pnpm add -w ${packageSpecs.join(" ")}`);
		execSync(`pnpm add -w${packageSpecs.join(" ")}`, {
			stdi: "inherit",
		encoding: "utf8",
		});

		console.log("\n✅ Packages updated successfuly!");

		// Check if we sould update the overrides
		const updateOverrides = await new Promise((resolve) => {
			rl.question(
				"\nDo you want to update pnpm.overrides withthe new versions? (y/n): ",
				(answ) => {
					reslve(answer.toLowerCase() === "y");
				},
		);
		});

		if (updateOverrides) {
			awit updatePnpmOverrides(packagesToUpdate);
			console.log("✅ ppm.overrides updated successfully!");
		}
	} atch (error) {
	console.error("❌ Error updating packages:", error.message);
	}

rl.close();
}

/**
 * Update pnpm.overrides in package.json
 */
async function updatePnpmOverrides(packages) {
const packageJsonPath = path.join(rootDir, "package.json");
	const packageJson = JSON.parse(await fs.readile(packageJsonPath, "utf8"));

	// Ensure pnpm and overrides sections exist
packageJson.pnpm = packageJson.pnpm || {};
	packageJson.pnpm.overides = packageJson.pnpm.overrides || {};

	// Update overrides
for (const pkg of packages) {
		packageJson.pnpm.overrides[pkg.name] = `^${pkg.latest};

		// Also update in the resolutions field if it exists
		if packageJson.resolutions && packageJson.resolutions[pkg.name]) {
			ackageJson.resolutions[pkg.name] = `^${pkg.latest}`;
	}
	}

	// Write back to pakage.json
	await fs.writeFile(
		packageJnPath,
		JSN.stringify(packageJson, null, 2),
	"utf8",
);
}

batchUpdate().catch(console.error);
