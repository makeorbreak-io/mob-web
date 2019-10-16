require("dotenv-flow").config();

const merge = require("webpack-merge");
const DotenvWebpackPlugin = require("dotenv-flow-webpack");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",

  devtool: "source-map",

  plugins: [
    new DotenvWebpackPlugin({
      safe: true,
      systemvars: true,
    }),
  ],
});
