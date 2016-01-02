import {login as kandyLogin} from './kandyActions';
import {login as attLogin} from './attActions';
import basic from 'basic-authorization-header';
import state from '../state';
import {progress, checkHTTPStatus, handleError} from '../helpers';
import history from '../history';

/**
 * Login action handler. Will
 * @param  {[type]} {username [description]
 * @param  {[type]} password} [description]
 * @return {[type]}           [description]
 */
export function login({username, password}) {
    // Store the username and password of the current user.
    state.select('user').merge({username, password});

    // Make a POST to our backend server to fetch tokens
    return progress(window.fetch('/api/tokens', {
        headers: {
            Authorization: basic(username, password)
        }
    })
    .then(checkHTTPStatus)
    .then(res => res.json())
    .then(tokens => {
        return Promise.all([
            kandyLogin(tokens.kandy),
            attLogin(tokens.att)
        ]);
    })
    .then(() => {
        // Once login is successful, navigate to the dashboard.
        history.push('/dashboard');
    })
    .catch(handleError));
}
