import React from 'react';
import ChatHistory from './chatHistory';
import ChatMessage from './chatMessage';

import {dispatch} from '../dispatcher';

const remoteMediaId = 'callRemoteMedia';

export default React.createClass({
    render() {

        var callButton;
        if (this.state.inCall) {
            callButton = <RaisedButton label="Hang up" onClick={this.onHangup}/>;
        } else {
            callButton = <RaisedButton label="Call" onClick={this.onMakeCall}/>;
        }

        return (
            <Paper>
                <div id={remoteMediaId}/>
                <div>
                    { callButton }
                </div>
                <ChatHistory messages={state.select}/>
                <ChatMessage onSendMessage={this.onSendMessage}/>
            </Paper>
        );
    },

    onSendMessage(message) {
        dispatch('sendMessage', { recipient: this.props.recipient, message});
    },

    onMakeCall() {
        dispatch('makeCall', {
            recipient: this.props.recipient,
            videoOn: true,
            remoteMediaId
        });
    },

    onHangup() {
        dispatch('hangup');
    },

    onClose() {
        dispatch('closeConversation', this.props.recipient);
    }
});
