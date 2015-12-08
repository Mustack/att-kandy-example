'use strict';

// We'll be using NeDB which has an interface very similar to mongodb, this will allow us
// to move our application to a real database when needed.
var Datastore = require('nedb');
var mkdirp = require('mkdirp');
var bluebird = require('bluebird');

// We'll hold our data in the ./data folder. Let's make sure it exists.
mkdirp.sync('./data');

// We want to use promises, but NeDB doesn't support them. We use bluebird (a Promise library) to promisify NeDB's api
// and make things easy for us.
function createCollection(name) {
    return bluebird.promisifyAll(new Datastore({ filename:`./data/${name}.db`, autoload: true }));
}

// Our database object, currently only holding a users collection.
var db = {
    users: createCollection('users')
};

// Let's make sure that our users have unique usernames.
db.users.ensureIndex({fieldName: 'username', unique: true });

module.exports = db;
