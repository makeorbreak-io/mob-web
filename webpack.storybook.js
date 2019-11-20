require("dotenv-flow").config();

const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
          "style-loader",
          "css-loader",
          { loader: "postcss-loader", options: { sourceMap: true } },
          "stylus-loader",
        ],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } },
          { loader: "postcss-loader", options: { sourceMap: true } },
          "sass-loader",
        ],
      },
      {
        test: /\.svg$/,
        use: [
          "file-loader",
          "svgo-loader",
          "svg-transform-loader",
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
};
