'use strict';
var express = require('express');
var bodyParser = require('body-parser');

var promiseHandler = require('./lib/promiseHandler');
var userService = require('./lib/userService');
var authService = require('./lib/authService');
var errors = require('./lib/errors');

var app = express();

// Add a JSON body parser middleware.
app.use(bodyParser.json());

// Serve our public folder statically.
app.use(express.static('public'));

// Let's define our REST users routes

app.route('/users')
.post(promiseHandler(req => userService.createUser(req.body)));

app.route('/tokens')
.post(promiseHandler(req => authService.createTokens(req.user)));


app.use(errors.middleware);

// Start the application.
var server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Server listening on port ${server.address().port}`);
});
