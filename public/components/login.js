import React from 'react';
import {Link} from 'react-router';
import {TextField, RaisedButton, FlatButton, Paper} from 'material-ui';
import Divider from 'material-ui/lib/divider';
import styles from './login.css';

export default React.createClass({
    render() {
        return (
            <Paper className={styles.loginForm}>
                <div>Let's get started.</div>
                <TextField hintText="e.g. josh" floatingLabelText="Username" />
                <TextField hintText="e.g. dog123" floatingLabelText="Password" type="password" />
                <Divider/>
                <div className={styles.buttonContainer}>
                    <Link to="register" className={styles.button}><FlatButton label="Register"/></Link>
                    <RaisedButton label="Login" primary={true} className={styles.button}/>
                </div>
            </Paper>
        );
    }
});
