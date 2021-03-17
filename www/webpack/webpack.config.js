"use strict";
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    web: "./www/src/web/index.js",
    mobile: "./www/src/mobile/index.js",
    phaser: "./www/src/phaser/index.ts",
  },
  output: {
    path: path.resolve("./www/build"),
    publicPath: "./build/",
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.(png|jpg|svg|ttf|eot|woff|woff2|mp3|wav|ogg)$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
    noParse: /\.min\.js/,
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ]
  },
  devtool: "source-map",
  target: "web",
  stats: {
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: false,
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
  },
  devServer: {
    hot: true,
    contentBase: path.resolve("./www/"),
    publicPath: "/build/",
    port: 8000,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};
