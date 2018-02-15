const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
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
    modules: [
      path.resolve(__dirname, "src"),
      "node_modules",
    ],

    extensions: [ ".js", ".json", ".styl", ".css" ],
  },

  plugins: [
    // Global implicit imports
    new Webpack.ProvidePlugin({
      Promise: "bluebird",
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
    }),

    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, "assets", "favicon.png"),
      title: "Make or Break",
    }),

    new Webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify(NODE_ENV),
      },
    }),
  ],
};
