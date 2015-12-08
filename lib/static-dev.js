'use strict';
var express = require('express');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('../webpack.config.js');

var staticDev = express.Router();

var compiler = webpack(webpackConfig);
var middleware = webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
    }
});

staticDev.use(middleware);
staticDev.use(webpackHotMiddleware(compiler));

module.exports = staticDev;
