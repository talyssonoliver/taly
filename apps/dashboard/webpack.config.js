import { resolve as _resolve } from "node:path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

import webpack from "webpack";
const { DefinePlugin } = webpack;


export const mode = process.env.NODE_ENV || "development";
export const entry = _resolve(__dirname, "src/main.tsx");
export const output = {
    path: _resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
};
export const resolve = {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
        "@components": _resolve(__dirname, "src/components"),
        "@hooks": _resolve(__dirname, "src/hooks"),
        "@layouts": _resolve(__dirname, "src/layouts"),
        "@services": _resolve(__dirname, "src/services"),
    },
};
export const module = {
    rules: [
        {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: "babel-loader",
        },
        {
            test: /\.css$/,
            use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            type: "asset/resource",
        },
    ],
};
export const plugins = [
    new CleanWebpackPlugin(),
    new DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
];
export const devServer = {
    historyApiFallback: true,
    port: 8080,
    hot: true,
    open: true,
};
