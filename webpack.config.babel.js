const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.port || "8080";

module.exports = {
  target: "web",

  context: path.resolve(__dirname, "src"),

  devtool: "inline-source-map",

  entry: [
    "react-hot-loader/patch",
    `webpack-dev-server/client?http://${HOST}:${PORT}`,
    "webpack/hot/only-dev-server",
    path.resolve(__dirname, "src", "index.js"),
  ],

  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].bundle.js",
    publicPath: "/",
  },

  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, "build"),
    publicPath: "/",
    host: HOST,
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: "eslint-loader", enforce: "pre" },
      { test: /\.js$/, exclude: /node_modules/, use: [ "react-hot-loader/webpack", "babel-loader" ] },
      { test: /\.json$/, loader: "json-loader" },
    ],
  },

  resolve: {
    alias: {
      // files
      "environment": path.resolve(__dirname, "src", "config", "environment.js"),

      // absolute paths
      "app": path.resolve(__dirname, "src", "app"),
      "components": path.resolve(__dirname, "src", "components"),
      "uikit": path.resolve(__dirname, "src", "components", "uikit"),
      "util": path.resolve(__dirname, "src", "util"),
      "enhancers": path.resolve(__dirname, "src", "enhancers"),
      "redux-root": path.resolve(__dirname, "src", "redux"),
    },
  },

  plugins: [
    // enable HMR globally
    new Webpack.HotModuleReplacementPlugin(),

    // prints more readable module names in the browser console on HMR updates
    new Webpack.NamedModulesPlugin(),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
    }),
  ]
};
