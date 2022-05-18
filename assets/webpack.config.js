const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (env) {
  return {
    entry: {
      app: './js/app.ts',
      single_sign: './js/SingleSignApp.tsx',
    },
    output: {
      path: path.resolve(__dirname, '../priv/static/js'),
      filename: '[name].js',
      publicPath: '/',
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: 'ts-loader' },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader'],
        },
      ],
    },
    resolve: {
      modules: ['node_modules', path.resolve(__dirname, 'js')],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
      new CopyWebpackPlugin({ patterns: [{ from: './static', to: '../' }] }),
      new MiniCssExtractPlugin({ filename: '../css/app.css' }),
    ],
  };
};
