'use strict';

var querystring = require('querystring');

// We'll use fetch which we can use on the browser side as well.
var fetch = require('node-fetch');
var config = require('./config');

// Standard headers
var defaultHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
};

var apiRoot = 'https://api.att.com';

module.exports =  {

    /**
     * Gets an AT&T OAuth token
     * @return {Promise} A promise for an object containing the OAuth token.
     */
    getOAuthToken() {
        // Setup the url, headers and the body of the request.
        var url = `${apiRoot}/oauth/v4/token`;
        var headers = defaultHeaders;
        var body = querystring.stringify({
            grant_type: 'client_credentials',
            client_id: config.att.key,
            client_secret: config.att.secret,
            scope: 'WEBRTC'
        });

        // Perform the post and then read the result as JSON
        return fetch(url, { method: 'POST', headers, body })
            .then(res => res.json());
    }
};
