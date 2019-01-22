const {
  resolve
} = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');
const TerserPlugin = require('terser-webpack-plugin');

const ENV = 'production';

module.exports = merge(baseConfig({ env: ENV }), {
  mode: 'production',

  entry: [
    // Main entrypoint
    './entry.tsx'
  ],

  devtool: 'source-map',

  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],

  optimization: {
    minimizer: [new TerserPlugin()]
  }
});