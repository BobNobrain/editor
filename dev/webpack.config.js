/**
 * Webpack configuration for development server
 */
// @ts-check
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DIST_DIR = path.resolve(__dirname, 'dist');

/** @type {import('webpack').Configuration} */
module.exports = {
    entry: path.resolve(__dirname, 'dev-launcher.js'),
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html'),
        }),
    ],
    devServer: {
        static: DIST_DIR,
    },
    output: {
        filename: 'bundle.js',
        path: DIST_DIR,
        clean: true,
    },
};
