import kandy from 'kandy';
import ewebrtc from 'ewebrtc-sdk';
import basic from 'basic-authorization-header';
import state from '../state';
import {progress, checkHTTPStatus, handleError} from '../helpers';
import history from '../history';

// Initializes Kandy.
function initializeKandy(userAccessToken) {
    kandy.setup();
    return new Promise((resolve, reject) => {
        kandy.loginSSO(userAccessToken,
            function onSuccess() {
                state.select('kandy').set('loggedIn', true);
                resolve();
            },
            function onFailure() {
                state.select('kandy').set('loggedIn', false);
                reject(new Error('Failed to login to Kandy.'));
            });
    });
}

// TODO: AT&T

export function login({username, password}) {

    // Make a POST to our backend server to fetch tokens
    progress(window.fetch('/tokens', {
        headers: {
            Authorization: basic(username, password)
        }
    })
    .then(checkHTTPStatus)
    .then(res => res.json())
    .then(tokens => {
        // Save the token for the user to allow authentication and such.
        state.select('kandy').set('token', tokens.kandy);

        var kandyInit = initializeKandy(tokens.kandy);

        return Promise.all([kandyInit]);
    })
    .then(() => {
        // Once login is successful, navigate to the dialer.
        history.push('/dialer');
    })
    .catch(handleError));
}
