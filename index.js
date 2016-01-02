'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var auth = require('./lib/auth');
var errors = require('./lib/errors');
var api = require('./lib/api');
var staticDev = require('./lib/static-dev');
var staticProd = require('./lib/static-prod');

var isDeveloping = process.env.NODE_ENV !== 'production';

var app = express();

// Add a JSON body parser middleware.
app.use(bodyParser.json());

// Add the authentication middleware.
app.use(auth.middleware);

// Add the API routes.
app.use('/api', api);

// Add the static routes
if (isDeveloping) {
    app.use(staticDev);
} else {
    app.use(staticProd);
}

// Errors middleware.
app.use(errors.middleware);

// Start the application.
var server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Server listening on port ${server.address().port}`);
});
