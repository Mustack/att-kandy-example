'use strict';
var data = require('./database');
var errors = require('./errors');
var security = require('./security');
var attService = require('./attService');
var kandyService = require('./kandyService');

module.exports = {
    createTokens(username, password) {
        // Find the user.
        return data.users.findOneAsync({ username })
            .then(user => {
                // Check if we have found the user.
                if (!user) {
                    throw new errors.ResourceNotFoundError('User not found');
                }

                // Check the password
                if (user.passwordHash !== security.hash(password, user.salt)) {
                    throw new errors.InvalidCredentialsError('Invalid username or password');
                }

                // Let's gather the AT&T and Kandy tokens. We do this in parallel because we can.
                return Promise.all([
                    attService.getOAuthToken(),
                    kandyService.getUserAccessToken(username)
                ]);
            })
            // Let's bundle the results in an object that the clients can use to
            // login to the services.
            .then(results => ({
                att: results[0],
                kandy: results[1]
            }));
    }
};
