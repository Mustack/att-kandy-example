import React from 'react';
import {Link} from 'react-router';
import {TextField, RaisedButton, FlatButton, Paper} from 'material-ui';
import {dispatch} from '../dispatcher';
import styles from './login.css';


/**
 * Component to display a login form.
 */
export default React.createClass({
    render() {
        return (
            <Paper className={styles.loginForm}>
                <div>Let's get started.</div>
                <TextField hintText="e.g. josh" floatingLabelText="Username"
                     onChange={this.createFieldHandler('username')}/>
                <TextField hintText="e.g. dog123" floatingLabelText="Password" type="password"
                     onChange={this.createFieldHandler('password')}/>
                <div className={styles.buttonContainer}>
                    <RaisedButton label="Login" primary={true} className={styles.button} onClick={this.login}/>
                    <Link to="register" className={styles.button}><FlatButton label="Register"/></Link>
                </div>
            </Paper>
        );
    },

    login() {
        // Since the state has the full payload, just use it as is.
        dispatch('login', this.state);
    },

    /**
     * Creates a change handler for a field name and associates the value to the key of the same name.
     * @param  {String} fieldName Name of the field to create a handler for.
     * @return {Function} Event handler function for the specified field.
     */
    createFieldHandler(fieldName) {
        return event => this.setState({[fieldName]: event.target.value});
    }
});
