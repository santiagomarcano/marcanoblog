require("dotenv").config();
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin } = require("webpack");
const { HotReloadPlugin } = require("./HotReloadPlugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const NodemonPlugin = require("nodemon-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

console.log(`[+] ENV ${process.env.NODE_ENV}`, "| epoch: ", Date.now());

const server = {
  mode: process.env.NODE_ENV,
  watch: process.env.NODE_ENV === "development",
  target: "node",
  entry: [path.join(__dirname, "src", "server.tsx")],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts|tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "../css/[name].css",
    }),
    new DefinePlugin({
      PORT: process.env.PORT,
      ENV: process.env.NODE_ENV,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, ".env"),
          to: path.join(__dirname, "dist"),
          globOptions: {
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
  stats: "minimal",
};

const client = {
  mode: process.env.NODE_ENV,
  target: "web",
  watch: process.env.NODE_ENV === "development",
  entry: [path.join(__dirname, "src", "app", "index.tsx")],
  output: {
    path: path.resolve(__dirname, "dist", "public", "assets", "js"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts|tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "../css/[name].css",
    }),
    new DefinePlugin({
      ...process.env,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, "public"),
          to: path.join(__dirname, "dist", "public"),
          globOptions: {
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
  stats: "minimal",
};

if (process.env.NODE_ENV === "development") {
  client.plugins = [
    ...client.plugins,
    new NodemonPlugin({
      script: path.resolve(__dirname, "dist", "main.js"),
    }),
    new HotReloadPlugin({
      // Different port to express server
      port: Number(process.env.PORT) + 1,
    }),
  ];
}

module.exports = [server, client];
