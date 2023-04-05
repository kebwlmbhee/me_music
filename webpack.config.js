const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    optimization: {
        minimizer: [new TerserPlugin({
          extractComments: false,
        })],
    }
};