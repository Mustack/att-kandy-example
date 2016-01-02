import kandy from 'kandy';
import state from '../state';

var kandyCursor = state.select('kandy');
var conversations = state.select('conversations');

function addMessage(recipient, message){
    // Make sure the conversation exists for this recipient.
    if (!conversations.exists({recipient})) {
        conversations.push({recipient, messages: []});
    }

    // Select the correct conversation matching the recipient.
    var conversation = conversations.select({recipient});

    // Add the message
    conversation.push('messages', message);
}


function onIncomingMessage(envelope) {
    addMessage(envelope.sender.full_user_id, {
        text: envelope.message.text,
        timestamp: envelope.timestamp,
        isIncoming: true
    });
}

function onOutgoingMessage(envelope) {
    addMessage(envelope.recipient, {
        text: envelope.message.text,
        timestamp: envelope.timestamp,
        isIncoming: false
    });
}

function onOutgoingMessageError(recipient, text, error) {
    addMessage(recipient, {
        text,
        isIncoming: false,
        timestamp: Date.now(),
        error
    });
}

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

export function sendMessage({userId, message}) {
    kandy.sendMessage(userId, message,
        onOutgoingMessage,
        onOutgoingMessageError.bind(null, userId, message));
}
