import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	// Provide optimizations for Storybook
	optimizeDeps: {
		include: ["storybook-dark-mode"],
	},
	// Configure server options if needed
	server: {
		fs: {
			// Allow serving files from the project root
			allow: [".."],
		},
	},
});
