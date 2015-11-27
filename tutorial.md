# AT&T Enhanced WebRTC and Kandy Tutorial

In this tutorial we will explore how to build an application that uses AT&T Enhanced WebRTC for calls and Kandy for collaborative features such as IM and Co-Browsing.


## Developer Hosted Server

To host our application and provide user management and authentication we will need a server component. We will be using Node.js with express as our backend technology stack along with AT&T and Kandy APIs for user authentication.

Let's start by building up a skeleton for our application:

```javascript
var express = require('express')
var bodyParser = require('body-parser');

var app = express();



var server = app.listen(process.env.PORT || 9001, function () {
    var address = server.address();
    var host = address.address;
    var port = address.port;

    if (address.family === 'IPv6') {
    host = `[${host}]`;
    }

    console.log('Server listening at http://%s:%s', host, port);
});

```

### API Keys

Both AT&T and Kandy use keys to authenticate API calls to their respective REST apis.

#### AT&T

When using AT&T APIs an application must fetch an OAuth token via

AT&T

### Users


1. Authentication


## Web Application

1. Calls
1. IM
1. Co-Browsing
