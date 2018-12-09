const path = require('path');
const common = require('./webpack.common');

module.exports = {
  ...common(),
  entry: './src/harness/server.ts',
  output: {
    filename: 'server.bundle.js',
    path: path.resolve(__dirname, 'dist', 'harness', 'server')
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist', 'harness', 'server'),
    port: 9001,
    https: true
  }
};