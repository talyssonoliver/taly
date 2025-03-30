/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
	],
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	core: {
		disableTelemetry: true,
		builder: {
			name: "@storybook/builder-vite",
			options: {
				viteConfigPath: "vite.config.ts",
			},
		},
	},
	features: {
		storyStoreV7: false,
	},
	// Add this to help with version compatibility issues
	typescript: {
		reactDocgen: "react-docgen-typescript",
		reactDocgenTypescriptOptions: {
			compilerOptions: {
				allowSyntheticDefaultImports: true,
				esModuleInterop: true,
			},
		},
	},
};

export default config;
