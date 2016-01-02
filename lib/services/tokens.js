'use strict';
var data = require('../database');
var errors = require('../errors');
var securityService = require('./security');
var attService = require('./att');
var kandyService = require('./kandy');

module.exports = {
    /**
     * Create tokens for both AT&T WebRTC and Kandy
     * @param  {String} username The username of the user to get the tokens for.
     * @param  {String} password Password of the user.
     * @return {Promise<Object>} Promise for the tokens.
     */
    createTokens(username, password) {
        // Find the user.
        return data.users.findOneAsync({ username })
            .then(user => {
                // Check if we have found the user.
                if (!user) {
                    throw new errors.ResourceNotFoundError('User not found');
                }

                // Check the password
                if (user.passwordHash !== securityService.hashPassword(password, user.salt)) {
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
