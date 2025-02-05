const path = require("node:path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
	mode: process.env.NODE_ENV || "development",
	entry: path.resolve(__dirname, "src/main.tsx"),
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
		publicPath: "/",
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"],
		alias: {
			"@components": path.resolve(__dirname, "src/components"),
			"@hooks": path.resolve(__dirname, "src/hooks"),
			"@layouts": path.resolve(__dirname, "src/layouts"),
			"@services": path.resolve(__dirname, "src/services"),
			"@pages": path.resolve(__dirname, "src/pages"),
		},
	},
	module: {
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
	},
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
		}),
	],
	devServer: {
		historyApiFallback: true,
		port: 3001,
		hot: true,
		open: true,
	},
};
