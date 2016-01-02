import ATT from 'att';
import state from '../state';

// The phone object.
var phone = ATT.rtc.Phone.getPhone();

var attCursor = state.select('att');

export function login(userId, token) {
    phone.on('error', onError);
    phone.on('session:ready', onSessionReady);
    phone.on('session:disconnected', onSessionDisconnected);
    phone.on('call:incoming', onIncomingCall);
    phone.on('call:connected', onConnectedCall);

    return associateAccessToken(userId, token).then(phone.login.bind(phone, {token}));
}

export function makeCall({recipient, videoOn, localMediaId, remoteMediaId}) {
    phone.dial({
        destination: recipient,
        mediaType: videoOn ? 'video' : 'audio',
        localMedia: localMediaId && document.getElementById(localMediaId),
        remoteMedia: remoteMediaId && document.getElementById(localMediaId)
    });
}

export function answerCall({videoOn, localMediaId, remoteMediaId}) {
    phone.answerCall({
        mediaType: videoOn ? 'video' : 'audio',
        localMedia: localMediaId && document.getElementById(localMediaId),
        remoteMedia: remoteMediaId && document.getElementById(localMediaId)
    });
}

function associateAccessToken(userId, token) {
    return new Promise((resolve, reject) => {
        phone.associateAccessToken({userId, token, resolve, reject});
    });
}

function onError({error}) {
    // TODO: Handle the error properly.
    state.push('errors', error);
}

function onSessionReady() {
    attCursor.set('loggedIn', true);
}

function onSessionDisconnected() {
    attCursor.set('loggedIn', false);
}

function onIncomingCall() {
    attCursor.set(['call','status'], 'ringing');
}

function onConnectedCall() {
    attCursor.set(['call','status'], 'connected');
}
