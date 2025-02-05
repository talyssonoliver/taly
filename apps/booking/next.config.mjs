/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	poweredByHeader: false,
	compiler: {
		styledComponents: true,
	},
	env: {
		API_BASE_URL: process.env.API_BASE_URL || "http://localhost:4000",
	},
	images: {
		domains: ["cdn.example.com", "images.taly.dev"],
		formats: ["image/avif", "image/webp"],
	},
	async redirects() {
		return [
			{
				source: "/old-bookings",
				destination: "/bookings",
				permanent: true,
			},
		];
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
				],
			},
		];
	},
	experimental: {
		optimiseCss: true,
		scrollRestoration: true,
	},
};

export default nextConfig;
