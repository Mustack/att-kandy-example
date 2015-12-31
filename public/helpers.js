import state from '../state';


/**
 * Helper method used to set a progress state (which can be used by a progress indicator) while during an
 * operation represented by a promise.
 * @param  {Promise} promise The promise for which to set a progress state.
 * @return {Promise} The promise.
 */
export function progress(promise) {
    state.select('user').set('progress', true);

    return promise.finally(() => {
        state.select('user').set('progress', false);
    });
}

/**
 * Handles errors.
 * @param  {Error} error The error that has occurred
 */
export function handleError(error) {
    state.select('errors').set('error', error);
}

/**
 * Checks a Response
 * @param  {Response} response The response to check the status of.
 * @return {[type]}          [description]
 */
export function checkHTTPStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}
