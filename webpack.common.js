const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => ({
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  plugins: [new HtmlWebpackPlugin()],
  devtool: 'source-map'
});