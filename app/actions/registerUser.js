import {progress, checkHTTPStatus, handleError} from '../helpers';
import history from '../history';

/**
 * Action handler for registering a user. Once the user is successfully registered
 * the handler will redirect the route to the login page.
 */
export function registerUser(userInformation) {

    // We need the country code but the UI doesn't allow us to specify it yet.
    var newUser = userInformation;
    newUser.countryCode = 'US';

    // Make a POST to our backend server to create an new user.
    progress(window.fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
    .then(checkHTTPStatus)
    .then(() => {
        // Successfully registered, go back to login page.
        history.push('/login');
    })
    .catch(handleError));
}
