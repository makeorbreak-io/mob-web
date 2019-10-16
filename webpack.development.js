require("dotenv-flow").config();

const merge = require("webpack-merge");
const Webpack = require("webpack");
const DotenvWebpackPlugin = require("dotenv-flow-webpack");

const common = require("./webpack.common.js");

const { PORT, HOST } = process.env;

const port = PORT || 8080;
const host = HOST || "0.0.0.0";

module.exports = merge(common, {
  mode: "development",

  devtool: "cheap-module-eval-source-map",

  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    host,
    port,
  },

  plugins: [
    new DotenvWebpackPlugin({
      safe: true,
    }),

    // enable HMR globally
    new Webpack.HotModuleReplacementPlugin(),

    // prints more readable module names in the browser console on HMR updates
    new Webpack.NamedModulesPlugin(),
  ],
});
