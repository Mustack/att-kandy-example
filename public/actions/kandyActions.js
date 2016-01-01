import kandy from 'kandy';
import state from '../state';

var kandyCursor = state.select('kandy');
var messagesCursor = kandyCursor.select('messages');

function onIncomingMessage(envelope) {
    var sender = envelope.sender.full_user_id;
    var message = envelope.message.text;
    var timestamp = envelope.timestamp;

    messagesCursor.push(sender, {message, timestamp, incoming: true});
}

function onOutgoingMessage(envelope) {
    var recipient = envelope.recipient;
    var message = envelope.message.text;
    var timestamp = envelope.timestamp;

    messagesCursor.push(recipient, {message, timestamp, incoming: false});
}

function onOutgoingMessageError(recipient, message, error) {
    messagesCursor.push(recipient, {message, timestamp: Date.now(), incoming: false, error});
}

export function initialize({userAccessToken}){

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

export function sendMessage({userId, message}) {
    kandy.sendMessage(userId, message,
        onOutgoingMessage,
        onOutgoingMessageError.bind(null, userId, message));
}
