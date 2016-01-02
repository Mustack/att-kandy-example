import React from 'react';
import {Paper} from 'material-ui';

export default React.createClass({
    render() {
        return (
            <Paper>
            { this.props.messages.map((message) =>
                <div>
                    {this.formatMessage(message)}
                </div>
            )}
            </Paper>
        );
    },

    formatMessage({sender, text, timestamp}) {
        var time = new Date();
        time.setTime(timestamp);

        return `[${time}] ${sender}: ${text}`;
    }
});
