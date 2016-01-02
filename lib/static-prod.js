'use strict';
var express = require('express');
var path = require('path');
var webpackConfig = require('../webpack.config.js');

var filesRouter = express.Router();

filesRouter.use('/vendor', express.static('vendor'));
filesRouter.use(express.static('assets'));

// Serve the files in the output folder.
filesRouter.use(express.static(webpackConfig.output.path));

// Fallback to the index file for any requests with different routes.
filesRouter.get('*', (req, res, next) => {
    if (req.accepts('html')) {
        res.sendFile(path.join(webpackConfig.output.path, '/index.html'));
    } else {
        next();
    }
});

module.exports = filesRouter;
