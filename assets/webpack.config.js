const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function(env) {
  const production = process.env.NODE_ENV === 'production';

  return {
    entry: './js/app.js',
    output: {
      path: path.resolve(__dirname, '../priv/static/js'),
      filename: 'app.js',
      publicPath: '/',
    },
    module: {
      noParse: /\.elm$/,
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [{loader: 'babel-loader'}]
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.elm$/,
          exclude: [/elm-stuff/, /node_modules/],
          loader: 'elm-webpack-loader?verbose=true&warn=true',
          options: {
            cwd: path.resolve(__dirname, "elm")
          }
        }
      ],
    },
    resolve: {
      modules: ['node_modules', path.resolve(__dirname, 'js')],
      extensions: ['.js'],
    },
    plugins: [
      new CopyWebpackPlugin([{from: "./static", to: "../"}]),
      new MiniCssExtractPlugin({ filename: "../css/app.css"})
    ]
  };
};
