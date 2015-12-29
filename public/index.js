import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, IndexRedirect, Redirect} from 'react-router';
import history from './history';

import App from './components/app';
import Login from './components/login';
import Register from './components/register';
import Dialer from './components/dialer';
import Conversation from './components/conversation';

import './index.css';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

// Render the application
ReactDOM.render(
    <Router history={history}>
        <Route path="/" component={App}>
            <IndexRedirect to="login"/>
            <Route path="login" component={Login}/>
            <Route path="register" component={Register}/>
            <Route path="dialer" component={Dialer}/>
            <Route path="conversation" component={Conversation}/>
            <Redirect path="*" to="login"/>
        </Route>
    </Router>
    , document.getElementById('root'));
