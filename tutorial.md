# AT&T Enhanced WebRTC and Kandy Tutorial

In this tutorial we will explore how to build an application that uses AT&T Enhanced WebRTC for calls and Kandy for collaborative features such as IM and Co-Browsing.

An example application based on this tutorial is available [here](https://github.com/Kandy-IO/att-kandy-example). The application example is based on the tutorial but contains some additional details that are omitted from the tutorial for brevity.

## Developer Hosted Server

To host our application and provide user management and authentication we will need a server component. We will be using Node.js with express as our backend technology stack along with AT&T and Kandy APIs for user authentication.

A few notes before we get started:
- Since we want to be modern, we will be using the latest stable Node.js (5.1.0 at the time of writing) and ES6 features that are supported out of the box such as Promises, arrow functions, template strings, etc...
- We will be using best practices whenever possible and practical.
- We will implement basic authentication and security.

Let's start by building up a skeleton for our application:

_index.js_
```javascript
'use strict';
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Add a JSON body parser middleware..
app.use(bodyParser.json());

// Serve our build folder statically.
app.use(express.static('dist'));

// Start the application.
var server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Server listening on port ${server.address().port}`);
});
```

This is pretty standard boilerplate so far.

## Users

Our application will need users, and to hold our users we will need to store them somewhere. For this we will use an in-memory database that is backed by simple JSON files. This will allow us to focus on our application logic.

Let's create a _database.js_ file which will hold all our application state.

_database.js_
```javascript
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
db.domains.ensureIndex({fieldName: 'username', unique: true });

module.exports = db;
```

### API Keys

Now, if we're going to be using AT&T and Kandy we need to have access to both APIs. So head on over to both [developer.att.com](https://developer.att.com) and [developer.kandy.io](https://developer.kandy.io) and create an account and a project for each.

Both AT&T and Kandy use keys to authenticate API calls to their respective REST apis. And once you've created your accounts and projects/apps you should have the following information available:

- AT&T App Key
- AT&T App Secret
- Kandy Project API Key
- Kandy Project API Secret

Let's store these in a configuration file for our application.

_lib/config.js_
```javascript
'use strict'

module.exports = {
    att: {
        key: 'abcdefghijklmnopqrstuvwxyz123456'
        secret: '123456abcdefghijklmnopqrstuvwxyz'
    },
    kandy: {
        key: 'DAK01234567890123456789012345678901'
        secret: 'DAS01234567890123456789012345678901'
    }   
}
```

### AT&T Authentication

When using AT&T APIs an application must fetch an OAuth token which can then be used to perform other operations. Let's create a function for this and add it to an _attService.js_ file for convenience and re-use.

_lib/attService.js_
```javascript
module.exports =  {
    /**
     * Gets an AT&T OAuth token
     * @return {Promise} A promise for an object containing the OAuth token.
     */
    getOAuthToken() {
        // Setup the url, headers and the body of the request.
        var url = 'https://api.att.com/oauth/v4/token';
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

```

### Kandy Authentication

Kandy uses a custom authentication that is very similar to OAuth. We need to create what Kandy calls a User Access Token to give our user the ability to login and use collaboration features.

We'll follow the same pattern on the Kandy side of things. We'll create a _kandyService.js_ file and add to it the functions we need to get this token.

_lib/services/kandy.js_
```javascript
module.exports = {
    getUserAccessToken(username) {
        var url = `${config.kandy.apiRoot}domains/users/accesstokens`;
        var params = querystring.stringify({
            key: config.kandy.key,
            domain_api_secret: config.kandy.secret,
            user_id: username
        });

        return fetch(`${url}?${params}`)
            .then(res => res.json())
            .then(jsonRes => jsonRes.result.user_access_token);
    }
};
```

> **Note:** Notice a small difference here between AT&T and Kandy: The later requires a username. Kandy always operates with users for all of it's operations, this has implications when dealing with the application's users. We will come back to this later.


## Web Application

Now that we have a back-end application server we will need to build the front end to expose all of this functionality to our users. The [demo application](https://github.com/Kandy-IO/att-kandy-example) provided with this tutorial includes this front end. We will go through the broad steps of how this was built and how to extend it with further capabilities.

Similar to the back-end we use modern tools to help us deliver a great experience.
* We will be using ES6, [React](https://facebook.github.io/react/) with JSX and [CSS Modules](https://github.com/css-modules/css-modules) all backed by [webpack](https://webpack.github.io/) for module bundling and management.
* For an easy modern look we will be using the [material-ui](http://www.material-ui.com/) React components.
* The demo application includes a development mode that allows for (hot module replacement)[https://webpack.github.io/docs/hot-module-replacement.html] which is a must for quick iterations while developing.


### Application State

Although the Kandy team highly recommends [Redux](http://redux.js.org/) as a Flux implementation in this demo we have used a more lightweight Flux approach by using an event emitter as a dispatcher and [Baobab](https://github.com/Yomguithereal/baobab) as a store for the application state.

Here is our simple dispatcher:
_app/dispatcher.js_
```javascript
import Emitter from 'emmett';
var emitter = new Emitter();

export function dispatch(action, payload ){
    emitter.emit(action, payload);
}

export function register(action, actionHandler) {
    emitter.on(action, actionHandler);
}
```

Our state will be held fully into one Baobab tree. Here is how we initialize our state:
_app/state.js_
```javascript
import Baobab from 'baobab';
import ReactAddons from 'react/addons';

export default new Baobab({
    user: {
        loggedIn: Baobab.dynamicNode(
            ['kandy', 'loggedIn'],
            ['att', 'loggedIn'],
            (kandyLoggedIn, attLoggedIn) => kandyLoggedIn && attLoggedIn
        ),
        progress: false
    },
    kandy: {
        loggedIn: false
    },
    att: {
        loggedIn: false
    }
}, {
    shiftReferences: true,
    mixins: [ReactAddons.addons.PureRenderMixin]
});
```
### Application Components

The demo application is entirely built of React components. React-Router is used to associate specific React components to URL routes.

Here is how our demo application defines it's routes:
_app/index.js_
```javascript
ReactDOM.render(
    <Router history={history}>
        <Route path="/" component={App}>
            <IndexRedirect to="login"/>
            <Route path="login" component={Login} onEnter={requireNoAuth}/>
            <Route path="register" component={Register} onEnter={requireNoAuth}/>
            <Route path="dashboard" component={Dashboard} onEnter={requireAuth}/>
            <Redirect path="*" to="login"/>
        </Route>
    </Router>
    , document.getElementById('root'));
```

You can think of these components as Views or Smart Components because they rely on the application state and the dispatcher directly.

Other components that are standalone don't need the state or dispatcher and will build their internal state from properties and will communicate their outputs via callbacks.

### Action Handlers

Action handlers are where we add the business logic of our application. They will handle incoming user inputs from the UI and change the application's state as necessary.

Note that the UI will be updated based on update notifications it receives from the state.

Here is an example action handler for the login to kandy action:
_app/actions/kandyActions.js_
```javascript
export function login({userAccessToken}){

    // Store the user access token.
    kandyCursor.set('token', userAccessToken);

    // Mandatory setup of kandy.
    kandy.setup();

    // Register for notifications.
    kandy.on('message', onIncomingMessage);

    return new Promise((resolve, reject) => {
        kandy.loginSSO(userAccessToken,
            function onSuccess() {
                kandyCursor.set('loggedIn', true);
                resolve();
            },
            function onFailure() {
                kandyCursor.set('loggedIn', false);
                reject(new Error('Failed to login to Kandy.'));
            });
    });
}
```

# Additional Features

This demo application contains the barebones necessary to use AT&T Enhanced WebRTC and Kandy together. The exiting things you can do with these frameworks are up to you. Now that you have the account creation and login done you can easily add features such as:

- Video and Voice Calls
- Screen sharing
- Chat Messaging
- Group Messaging
- Co-Browsing
- Address Book
- WebSocket based communications (called Sessions in Kandy).

For Kandy several resources are at your disposal for implementing the collaboration features mentioned above:
- Tutorials: [developer.kandy.io/tutorials](https://developer.kandy.io/tutorials)
- Documentation: [developer.kandy.io/docs](https://developer.kandy.io/docs)

For the AT&T Enhanced WebRTC visit [developer.att.com](https://developer.att.com) for AT&T Enhanced WebRTC documentation and features.
