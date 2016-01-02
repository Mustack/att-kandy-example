'use strict';
var express = require('express');

var promiseHandler = require('./promiseHandler');
var userService = require('./services/user');
var tokensService = require('./services/tokens');
var requireAuth = require('./auth').requireAuth;

var apiRouter = express.Router();

apiRouter.route('/users')
.post(
    promiseHandler(
        req => userService.createUser(req.body)
    )
);

apiRouter.route('/tokens ')
.post(
    requireAuth(
    promiseHandler(
        req => tokensService.createTokens(req.user.username, req.user.password)
    ))
);

module.exports = apiRouter;
