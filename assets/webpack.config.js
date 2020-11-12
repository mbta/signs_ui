const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function(env) {
  const production = process.env.NODE_ENV === 'production';

  return {
    entry: './js/app.ts',
    output: {
      path: path.resolve(__dirname, '../priv/static/js'),
      filename: 'app.js',
      publicPath: '/',
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: "ts-loader" },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ],
    },
    resolve: {
      modules: ['node_modules', path.resolve(__dirname, 'js')],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
      new CopyWebpackPlugin({patterns: [{from: "./static", to: "../"}]}),
      new MiniCssExtractPlugin({ filename: "../css/app.css"})
    ]
  };
};
