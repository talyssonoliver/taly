import { resolve } from "node:path";

export const reactStrictMode = true;
export function webpack(config) {
    config.resolve.alias = {
        ...config.resolve.alias,
        "@components": resolve(__dirname, "src/components"),
        "@pages": resolve(__dirname, "src/pages"),
        "@styles": resolve(__dirname, "src/styles"),
        "@utils": resolve(__dirname, "src/utils"),
        "@hooks": resolve(__dirname, "src/hooks"),
        "@services": resolve(__dirname, "src/services"),
    };
    return config;
}
export const images = {
    domains: ["localhost", "example.com"],
};
