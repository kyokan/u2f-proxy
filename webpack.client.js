const path = require('path');
const common = require('./webpack.common');

module.exports = {
  ...common(),
  entry: './src/harness/client.ts',
  output: {
    filename: 'client.bundle.js',
    path: path.resolve(__dirname, 'dist', 'harness', 'client')
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist', 'harness', 'client'),
    port: 9000,
    https: true
  }
};