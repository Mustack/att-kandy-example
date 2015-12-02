'use strict';

var jsSHA = require('jssha');
var crypto = require('crypto');

module.exports = {

    /**
     * Hashes a password using the provided salt.
     *
     * @param  {String} password The password to hash
     * @param  {String} salt     The salt used for securing the hash
     * @return {String} Base64 encoded hash.
     */
    hashPassword(password, salt) {
        var hasher = new jsSHA('SHA-512', 'TEXT');
        hasher.update(password + salt);
        return hasher.getHash('B64');
    },

    /**
     * Returns a random series of bytes.
     * @param  {Number} byteCount The number of bytes to return
     * @return {String} Base64 encoded random bytes.
     */
    randomBytes(byteCount) {
        var buffer = crypto.randomBytes(byteCount);
        return buffer.toString('base64');
    }
};
