const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const utils = require('./utils.js');

const { NODE_ENV } = process.env;
if (NODE_ENV !== 'production' && NODE_ENV !== 'development') {
  throw new Error('Must set NODE_ENV to either production or development.');
}

const IS_DEV = NODE_ENV === 'development';
const SRC_PATH = utils.root('src');
const SHARED_STYLES_PATH = utils.root('src/assets/styles');

const jsLoaders = (other) => [{
  loader: 'babel-loader'
}, ...other];

function srcPath(subdir) {
  return  path.join(SRC_PATH, subdir);
}

module.exports = env => ({

  context: SRC_PATH,
  // Allow TypeScript files to be treated as normal JS :)
  resolve: {
    alias: {
      "@assets": srcPath('assets'),
      "@actions": srcPath('actions'),
      "@components": srcPath('components'),
      "@constants": srcPath('constants'),
      "@features": srcPath('features'),
      "@hocs": srcPath('hocs'),
      "@models": srcPath('models'),
      "@node": path.resolve('node_modules'),
      "@reducers": srcPath('reducers'),
      "@root": srcPath('.'),
      "@selectors": srcPath('selectors'),
      "@stores": srcPath('stores'),
      "@utils": srcPath('utils'),
      "@wrappers": srcPath('wrappers')
    },
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },

  output: {
    path: utils.root('dist/docker/www'),
    filename: '[name].[hash].bundle.js',
    chunkFilename: '[id].[hash].chunk.js',
    publicPath: '/'
  },


  module: {
    rules: [{
        test: /\.(sa|sc|c)ss$/,
        exclude: [/node_modules/, SHARED_STYLES_PATH],
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader : 'css-loader',  
            options: {
              importLoaders: 1,
              localIdentName: '[path][local]_[hash:base64:5]',
              modules: true,
              publicPath: '../'
            },
          },
          'sass-loader'
        ],
    }, {
      test: /\.css$/,
      include: [/node_modules/, SHARED_STYLES_PATH],
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: jsLoaders([])
    }, {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: jsLoaders([{
        loader: 'ts-loader'
      }])
    }, {
      test: /\.tsx?$/,
      loader: 'tslint-loader',
      // Force TSLint before other loaders
      enforce: 'pre'
    }, 
    {
      test: /\.(gif|png|jpg|jpeg|svg)?$/,
      loader: 'file-loader',
      options: {
        name: 'assets/images/[name].[ext]',
      },
    },
    {
      test: /\.(ttf|eot|woff|woff2)$/,
      loader: 'file-loader',
      options: {
        name: 'assets/fonts/[name].[ext]',
      },
    }]
  },
  plugins: [
    // Actually output extracted CSS
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: IS_DEV ? '[name].css' : '[name].[hash].css',
      chunkFilename: IS_DEV ? '[id].css' : '[id].[hash].css',
    }),
    // Generate an HTML-file to include all bundle outputs
    new HtmlWebpackPlugin({
      template: './index.ejs',
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    // Inject proper value for NODE_ENV into build
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    })
  ],
});
