import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, IndexRedirect, Redirect} from 'react-router';
import history from './history';
import state from './state';

import App from './components/app';
import Login from './components/login';
import Register from './components/register';
import Dialer from './components/dialer';
import Conversation from './components/conversation';

// Add .finally to promises
import 'promise.prototype.finally';

import './index.css';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

/**
 * onEnter hook handler which checks whether the user is logged in and if not redirect to login.
 */
function requireAuth(nextState, replaceState) {
    if (!state.get('user','loggedIn')) {
        replaceState({ nextPathname: nextState.location.pathname }, '/login');
    }
}

/**
 * onEnter hook handler which checks if already logged in and if so, redirects to dialer state.
 */
function requireNoAuth(nextState, replaceState) {
    if (state.get('user','loggedIn')) {
        replaceState({ nextPathname: nextState.location.pathname }, '/dialer');
    }
}

// Render the application
ReactDOM.render(
    <Router history={history}>
        <Route path="/" component={App}>
            <IndexRedirect to="login"/>
            <Route path="login" component={Login} onEnter={requireNoAuth}/>
            <Route path="register" component={Register} onEnter={requireNoAuth}/>
            <Route path="dialer" component={Dialer} onEnter={requireAuth}/>
            <Route path="conversation/:username" component={Conversation} onEnter={requireAuth}/>
            <Redirect path="*" to="login"/>
        </Route>
    </Router>
    , document.getElementById('root'));
