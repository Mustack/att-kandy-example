'use strict';

var fetch = require('node-fetch');
var querystring = require('querystring');
var config = require('./config');
var errors = require('./errors');

var apiRoot = 'https://api.kandy.io/v1.2';

/**
 * Standard way to parse a kandy response.
 * @param  {Response} response The response object.
 * @return {Promise<Object>} The parsed response result.
 */
function parseKandyResponse(response) {
    return response.json()
        .then(jsonResponse => {
            if (jsonResponse.status !== 0) {
                throw new errors.KandyError(jsonResponse);
            }

            return jsonResponse.result;
        });
}

/**
 * Get a Kandy domain access token. This token allows domain level operations. It's equivalent to
 * holding the API Key and Secret together.
 *
 * @return {String} Domain access token.
 */
function getDomainAccessToken() {
    var url = `${apiRoot}/domains/accesstokens`;
    var params = querystring.stringify({
        key: config.kandy.key,
        domain_api_secret: config.kandy.secret
    });

    return fetch(`${url}?${params}`)
        .then(parseKandyResponse)
        .then(result => result.domain_access_token);
}

/**
 * Get a Kandy user access token. This token allows user level operations. It's equivalent to
 * holding the username and password for a user.
 *
 * @param {String} username The username for which to retrieve the User access token.
 * @return {String} User access token.
 */
function getUserAccessToken(username) {
    var url = `${apiRoot}/domains/users/accesstokens`;
    var params = querystring.stringify({
        key: config.kandy.key,
        domain_api_secret: config.kandy.secret,
        user_id: username
    });

    return fetch(`${url}?${params}`)
        .then(parseKandyResponse)
        .then(result => result.user_access_token);
}

/**
 * Creates a kandy user. Note that this user doesn't have a password, it can only be used
 * by getting his user access token.
 *
 * @param {Object} userDescription The description of the user to create.
 * @param {String} userDescription.username The username for the new user.
 * @param {String} userDescription.firstName The first name for the new user.
 * @param {String} userDescription.lastName The last name for the new user.
 * @param {String} userDescription.email The email for the new user.
 * @param {String} userDescription.countryCode The 2 letter country code for the new user.
 *
 * @return {Promise<Object>} A promise for a user description object.
 */
function createUser(userDescription) {
    return getDomainAccessToken()
        .then(domainAccessToken => {
            // Create the kandy user
            var url = `${apiRoot}/domains/users/user_id`;
            var body = JSON.stringify({
                user_id: userDescription.username,
                user_first_name: userDescription.firstName,
                user_last_name: userDescription.lastName,
                user_email: userDescription.email,
                user_country_code: userDescription.countryCode
            });

            return fetch(`${url}?key=${domainAccessToken}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body
            })
            .then(parseKandyResponse)

            // Disregard what comes from kandy on success, we don't want to
            // expose that information.
            .then(() => userDescription);
        });
}


module.exports = {
    getDomainAccessToken,
    getUserAccessToken,
    createUser
};
