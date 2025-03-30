import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	transpilePackages: ["@taly/shared-ui"],
	output: "standalone",
	compiler: {
		styledComponents: true,
	},
	env: {
		NEXT_PUBLIC_API_BASE_URL:
			process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000",
	},
	images: {
		domains: ["localhost", "example.com", "cdn.taly.dev"],
		formats: ["image/avif", "image/webp"],
	},
	webpack(config, { isServer }) {
		config.resolve.alias = {
			...config.resolve.alias,
			"@components": path.resolve(__dirname, "src/components"),
			"@pages": path.resolve(__dirname, "src/pages"),
			"@styles": path.resolve(__dirname, "src/styles"),
			"@utils": path.resolve(__dirname, "src/utils"),
			"@hooks": path.resolve(__dirname, "src/hooks"),
			"@services": path.resolve(__dirname, "src/services"),
			"@": path.resolve(__dirname, "./src"),
		};

		// Add support for TypeScript files
		config.module.rules.push({
			test: /\.tsx?$/,
			use: "next-swc-loader",
			include: [path.resolve(__dirname, "../shared-ui/src")],
		});

		// Add any custom Babel configuration here if needed

		return config;
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=31536000; includeSubDomains; preload",
					},
				],
			},
		];
	},
	experimental: {
		optimizeCss: false, // Disable until critters is properly installed
		scrollRestoration: true,
	},
};

export default nextConfig;
