'use strict';
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',
    entry: [
        'webpack-hot-middleware/client?reload=true',
        path.join(__dirname, 'public/index.js')
    ],
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: '[name].js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public/index.tpl.html'),
            inject: 'body',
            filename: 'index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders: [
            // CSS loader with CSS Modules support (see https://github.com/css-modules/webpack-demo).
            { test: /\.css$/, loaders: [
                'style',
                'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                'postcss'
            ]},

            // ES6 loader using Babel
            { test: /\.js?$/, include: path.join(__dirname, 'public'), loader: 'babel-loader' }
        ]
    },

    postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ]
};
