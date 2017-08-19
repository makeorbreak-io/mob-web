const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const { NODE_ENV } = process.env;

module.exports = {
  target: "web",

  context: path.resolve(__dirname, "src"),

  entry: [
    path.resolve(__dirname, "src", "index.js"),
  ],

  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].bundle.js",
    publicPath: "/",
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: "eslint-loader", enforce: "pre" },
      { test: /\.js$/, exclude: /node_modules/, use: [ "react-hot-loader/webpack", "babel-loader" ] },
      { test: /\.json$/, use: "json-loader" },
      { test: /\.css$/, use: [ "style-loader", "css-loader" ] },
      { test: /\.styl$/, use: [ "style-loader", "css-loader", { loader: "postcss-loader", options: { sourceMap: true} }, "stylus-loader" ] },
      { test: /\.svg$/, use: [ "file-loader", "svgo-loader" ] },
      { test: /\.(jpe?g|png|gif)$/i, use: [ "url-loader?limit=10000", "img-loader" ] },
    ],
  },

  resolve: {
    extensions: [ ".js", ".json", ".styl", ".css" ],

    alias: {
      // files
      "action-types": path.resolve(__dirname, "src", "redux", "action_types.js"),
      "environment": path.resolve(__dirname, "src", "config", "environment.js"),
      "validators": path.resolve(__dirname, "src", "validators", "index.js"),

      // absolute paths
      "actions": path.resolve(__dirname, "src", "redux", "actions"),
      "api": path.resolve(__dirname, "src", "api"),
      "assets": path.resolve(__dirname, "src", "assets"),
      "components": path.resolve(__dirname, "src", "components"),
      "constants": path.resolve(__dirname, "src", "constants"),
      "core": path.resolve(__dirname, "src", "components", "core"),
      "enhancers": path.resolve(__dirname, "src", "enhancers"),
      "redux-root": path.resolve(__dirname, "src", "redux"),
      "root": path.resolve(__dirname, "src"),
      "uikit": path.resolve(__dirname, "src", "components", "uikit"),
      "util": path.resolve(__dirname, "src", "util"),
    },
  },

  plugins: [
    // Global implicit imports
    new Webpack.ProvidePlugin({
      Promise: "bluebird",
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
    }),

    new Webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify(NODE_ENV),
      },
    }),
  ],
};
