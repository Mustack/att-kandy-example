'use strict';

var _ = require('lodash');

/**
 * Error used to indicate invalid credentials.
 */
class InvalidCredentialsError extends Error {}
InvalidCredentialsError.prototype.status = 403;

/**
 * Error for a resource request causing a conflict.
 */
class ResourceConflictError extends Error {}
ResourceConflictError.prototype.status = 409;

/**
 * Error for a resource not found.
 */
class ResourceNotFoundError extends Error {}
ResourceNotFoundError.prototype.status = 404;

/**
 * Generic error coming in from kandy.
 */
class KandyError extends Error {
    constructor(kandyResponse) {
        var message = 'Unknown Kandy error.';
        message = _.get(kandyResponse, 'message', message);
        message = _.get(kandyResponse, 'results.error.message', message);

        var status = _.get(kandyResponse, 'meta.status_code', 500);

        super(message);
        this.status = status;
    }
}

/**
 * Error handling express middleware.
 */
function middleware(err, req, res, next) { // eslint-disable-line no-unused-vars
    var status = err.status || 500;
    var message = err.message || 'An unknown error has occured';

    res.status(status).send(message);
}

module.exports = {
    InvalidCredentialsError,
    ResourceConflictError,
    ResourceNotFoundError,
    KandyError,
    middleware
};
