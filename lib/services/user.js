'use strict';

var _ = require('lodash');
var data = require('../database');
var errors = require('../errors');
var securityService = require('./security');
var kandyService = require('./kandy');

function sanitizeUser(user) {
    return _.pick(user,
        'username',
        'firstName',
        'lastName'
    );
}

module.exports = {

    createUser(userDescription) {
        var salt = securityService.randomBytes(16);

        return data.users.findOneAsync({
            username: userDescription.username
        })
        .then(user => {
            if (user) {
                throw new errors.ResourceConflictError('User already exists');
            }
        })
        .then(() => {
            var insertDBPromise = data.users.insertAsync({
                username: userDescription.username,
                firstName: userDescription.firstName,
                lastName: userDescription.lastName,
                email: userDescription.email,
                countryCode: userDescription.countryCode,
                passwordHash: securityService.hashPassword(userDescription.password, salt),
                salt: salt
            });

            var kandyUserPromise = kandyService.upsertUser(userDescription);

            return Promise.all([insertDBPromise, kandyUserPromise]);
        })
        // Sanitize the user so we don't send any unwanted information to the client.
        .then(sanitizeUser);
    }
};
