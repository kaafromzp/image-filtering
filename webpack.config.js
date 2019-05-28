const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const outPath = path.join(__dirname, '/dist');

module.exports = {
    entry: {
        main: './src/ImageFilteringHelper.js'
    },
    output: {
        filename: 'image-filtering.js',
        sourceMapFilename: 'image-filtering.js.map',
        path: outPath,
        library: 'ImageFilteringHelper',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    warnings: false,
                    compress: {
                        drop_console: true
                    },
                    output: {
                        comments: false
                    }
                }
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.glsl/,
                use: 'raw-loader'
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
              }
        ]
    }
};
