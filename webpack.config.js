require("dotenv").config();
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const NodemonPlugin = require("nodemon-webpack-plugin");

const server = {
  mode: process.env.NODE_ENV,
  watch: true,
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
      // {
      //   test: /\.css$/,
      //   use: [MiniCssExtractPlugin.loader, "css-loader"],
      // },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  plugins: [
    new NodemonPlugin({
      script: path.resolve(__dirname, "dist", "main.js"),
      watch: path.resolve(__dirname, "src"),
    }),
    // new MiniCssExtractPlugin({
    //   filename: "assets/css/[name].css",
    // }),
  ],
  stats: "errors-only",
  // devServer: {
  //   compress: true,
  //   historyApiFallback: true,
  //   overlay: true,
  // },
};

const client = {
  mode: process.env.NODE_ENV,
  target: "web",
  watch: true,
  entry: [path.join(__dirname, "src", "app", "index.tsx")],
  output: {
    path: path.resolve(__dirname, "dist", "public"),
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
      // {
      //   test: /\.css$/,
      //   use: [MiniCssExtractPlugin.loader, "css-loader"],
      // },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  plugins: [
    // new NodemonPlugin({
    //   script: path.resolve(__dirname, "dist", "main.js"),
    //   watch: path.resolve(__dirname, "src"),
    // }),
    new MiniCssExtractPlugin({
      filename: "assets/css/[name].css",
    }),
  ],
  stats: "errors-only",
};

module.exports = [server, client];
