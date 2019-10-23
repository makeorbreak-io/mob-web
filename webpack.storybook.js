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
        test: /\.woff(2)?$/,
        use: [
          { loader: "file-loader", options: { outputPath: "fonts/" } },
        ],
      },
      {
        test: /\.svg$/,
        use: [ "file-loader", "svgo-loader" ],
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
