module.exports = {
  "presets": [
    ["@babel/preset-env", {
      "loose": true,
      "modules": false,
      "targets": {
        "browsers": [
          "last 2 versions",
          "safari >= 9",
        ],
      },
      "corejs": "3",
    }],
    "@babel/preset-react",
  ],

  "plugins": [
    "react-hot-loader/babel",
    ["@babel/plugin-proposal-class-properties", { "spec": true }],
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-do-expressions",
  ],
};
