'use strict';
var express = require('express');

var promiseHandler = require('./promiseHandler');
var userService = require('./services/user');
var authService = require('./services/authentication');

var apiRouter = express.Router();

// Let's define our REST users routes
apiRouter.route('/users')
.post(promiseHandler(req => userService.createUser(req.body)));

apiRouter.route('/tokens ')
.post(promiseHandler(req => authService.createTokens(req.user.username, req.user.password)));

module.exports = apiRouter;
