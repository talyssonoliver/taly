export default {
  reactStrictMode: true,
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
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
};
