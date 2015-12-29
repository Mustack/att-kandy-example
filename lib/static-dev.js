'use strict';
var express = require('express');
var path = require('path');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('../webpack.config.js');

var filesRouter = express.Router();

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

filesRouter.use(middleware);
filesRouter.use(webpackHotMiddleware(compiler));

// Fallback to the index file for any requests with different routes.
filesRouter.get('*', (req, res, next) => {
    if (req.accepts('html')) {
        res.send(middleware.fileSystem.readFileSync(path.join(webpackConfig.output.path, '/index.html'), 'utf8'));
    } else {
        next();
    }
});

module.exports = filesRouter;
