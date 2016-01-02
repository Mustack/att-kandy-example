import React from 'react';
import {Paper} from 'material-ui';
import styles from './dashboard.css';

export default React.createClass({
    render() {
        return (
            <Paper className={styles.dashboard}>
                <div className={styles.title}>
                    TODO: Your awesome application!
                </div>
                Come see us at the Kandy table for an awesome onesie and some help!
            </Paper>
        );
    }
});
