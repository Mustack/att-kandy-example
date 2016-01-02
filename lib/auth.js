'use strict';
var auth = require('basic-auth');
var errors = require('./errors');

/**
 * Parses the Authorization header and fills in the req.user variable appropriately.
 */
function middleware(req, res, next) {
    // Parse the authorization header and add the user to request.
    req.user = auth(req);
    next();
}

/**
 * Request handler decorator that makes sure the request is authenticated before
 * delegating to the wrapped handler.
 */
function requireAuth(requestHandler) {
    return function(req, res, next) {
        if (!req.user) {
            next(new errors.InvalidCredentialsError());
        } else {
            requestHandler(req, res, next);
        }
    };
}

module.exports = {
    middleware,
    requireAuth
};
