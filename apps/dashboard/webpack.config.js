import { resolve as _resolve } from "node:path";

import { CleanWebpackPlugin } from "clean-webpack-plugin";
import dotenv from "dotenv";
import webpack from "webpack";

dotenv.config();
const { DefinePlugin } = webpack;

export default {
  mode: process.env.NODE_ENV || "development",
  entry: _resolve(__dirname, "src/main.tsx"),
  output: {
    path: _resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  cache: true,
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    alias: {
      "@components": _resolve(__dirname, "src/components"),
      "@hooks": _resolve(__dirname, "src/hooks"),
      "@layouts": _resolve(__dirname, "src/layouts"),
      "@services": _resolve(__dirname, "src/services"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "ts-loader",
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
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.API_BASE_URL": JSON.stringify(
        process.env.API_BASE_URL || "http://localhost:4000"
      ),
    }),
  ],
  devServer: {
    historyApiFallback: true,
    port: 8080,
    hot: true,
    open: true,
    client: {
      overlay: true,
    },
  },
};
