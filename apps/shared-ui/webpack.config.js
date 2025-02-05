const path = require("node:path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
	mode: process.env.NODE_ENV || "development",
	entry: path.resolve(__dirname, "src/index.ts"),
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "index.js",
		library: "SharedUI",
		libraryTarget: "umd",
		publicPath: "/",
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"],
		alias: {
			"@components": path.resolve(__dirname, "src/components"),
			"@styles": path.resolve(__dirname, "src/styles"),
			"@utils": path.resolve(__dirname, "src/utils"),
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
	externals: {
		react: "React",
		"react-dom": "ReactDOM",
	},
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
		}),
	],
	devServer: {
		historyApiFallback: true,
		port: 3003,
		hot: true,
		open: true,
	},
};
