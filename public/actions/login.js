import {initialize as initializeKandy} from './kandyActions';
import {initialize as initializeAtt} from './attActions';
import basic from 'basic-authorization-header';
import state from '../state';
import {progress, checkHTTPStatus, handleError} from '../helpers';
import history from '../history';



export function login({username, password}) {

    state.select('user').merge({username, password});

    // Make a POST to our backend server to fetch tokens
    return progress(window.fetch('/tokens', {
        headers: {
            Authorization: basic(username, password)
        }
    })
    .then(checkHTTPStatus)
    .then(res => res.json())
    .then(tokens => {
        var kandyInit = initializeKandy(tokens.kandy);
        var attInit = initializeAtt(tokens.att);

        return Promise.all([kandyInit, attInit]);
    })
    .then(() => {
        // Once login is successful, navigate to the dialer.
        history.push('/dialer');
    })
    .catch(handleError));
}
