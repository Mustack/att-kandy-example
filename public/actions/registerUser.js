import {progress, checkHTTPStatus, handleError} from '../helpers';
import history from '../history';

export function registerUser(userInformation) {

    // Make a POST to our backend server to create an new user.
    progress(window.fetch('/users', {
        method: 'POST',
        body: JSON.stringify(userInformation)
    })
    .then(checkHTTPStatus)
    .then(() => {
        // Successfully registered, go back to login page.
        history.push('/login');
    })
    .catch(handleError));
}
