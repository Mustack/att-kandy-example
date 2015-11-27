'use strict';
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Add a JSON body parser middleware..
app.use(bodyParser.json());

// Serve our public folder statically.
app.use(express.static('public'));

// Start the application.
var server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Server listening on port ${server.address().port}`);
});
