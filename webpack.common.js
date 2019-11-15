require("dotenv-flow").config();

const path = require("path");

const Webpack = require("webpack");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");

// const { API_URL } = process.env;

module.exports = {
  context: path.resolve(__dirname, "src"),

  entry: path.resolve(__dirname, "src", "index.js"),

  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].bundle.js",
    publicPath: "/",
  },

  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        use: [ "eslint-loader" ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [ "babel-loader" ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader",
        ],
      },
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { importLoaders: 1 } },
          { loader: "postcss-loader", options: { sourceMap: true } },
          "stylus-loader",
        ],
      },
      {
        test: /\.svg$/,
        use: [
          "file-loader",
          "svgo-loader",
          "svg-transform-loader"
        ],
      },
      {
        test: /\.woff(2)?$/,
        use: [
          { loader: "file-loader", options: { outputPath: "fonts/" } },
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [ "file-loader" ],
      },
    ],
  },

  resolve: {
    modules: [
      path.resolve(__dirname, "src"),
      "node_modules",
    ],

    extensions: [ ".js", ".json", ".css", ".styl" ],
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
      inject: true,
      title: "Make or Break",
    }),

    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
      chunkFilename: "[id].[hash].css",
    }),

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
    // new CspHtmlWebpackPlugin({
    //   "base-uri": ["'self'"],
    //   "block-all-mixed-content": [],
    //   "connect-src": [ "'self'", API_URL, "ws:" ],
    //   "default-src": ["'self'"],
    //   "font-src": ["'self'"],
    //   "form-action": ["'self'"],
    //   "frame-src": ["'none'"],
    //   "img-src": ["'self'", "data:", "blob:"],
    //   "manifest-src": ["'self'"],
    //   "media-src": ["'self'", "mediastream:"],
    //   "object-src": ["'none'"],
    //   "script-src": ["'self'"],
    //   "style-src": ["'self'"],
    // }),
  ],
};
