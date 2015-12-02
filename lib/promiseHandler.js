'use strict';

/**
 * Promise handler wraps a function that returns an object or a promise for an object
 * allowing it to be used as an express handler. If the request handler resolves to
 * a rejected promise, then the promise handler will pass the reject reason down the chain
 * where it can be handled by a middleware.
 *
 * @param  {(Request): any | Promise<any>} requestHandler The function that will handle this request.
 * @return {(Request, Response, Next): void} An express request handler.
 */
module.exports = function promiseHandler(requestHandler) {
    return function expressServiceHandler(req, res, next) {

        // Wrap the entire service call in a promise to ensure we can catch any exception.
        new Promise(function(resolve) {

            // Resolve the service call, this allows services to return the value
            // synchronously or asynchronously.
            resolve(requestHandler(req));
        })
        .then(result => res.json(result))
        .catch(err => next(err));
    };
};
