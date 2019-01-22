const {
  resolve
} = require('path')
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');
const webpack = require('webpack');

const ENV = 'development';

module.exports = merge(baseConfig({ env: ENV }), {
  mode: 'development',

  entry: [
    // HMR for React
    'react-hot-loader/patch',
    './entry.tsx'
  ],

  devtool: 'inline-source-map',

  devServer: {
    watchOptions: {
			ignored: [/node-modules/,'./test/**/*.test.tsx', './test/**/*.spec.tsx']
		},
    overlay: {
      errors: true,
    },
    contentBase: '.',
    stats: 'minimal',
    host: '0.0.0.0',
    disableHostCheck: true,
    port: 8000,
    // Serve index.html instead of 404
    historyApiFallback: false,
    // Enable Hot Module Reloading
    hotOnly: true,
    proxy: [{
      cookieDomainRewrite: "",
      context:
        function(pathname, req) {
          if (/^\/(test)/.test(pathname)) {
            return true;
          }
          return false;
        },
      target: 'http://localhost:8080',
      secure: false,
      changeOrigin: true
    }, ],
    publicPath: '/'
  },

  plugins: [
     // Enable HMR
     new webpack.HotModuleReplacementPlugin(),
     // More readable module names in HMR
     new webpack.NamedModulesPlugin()
  ]
});
