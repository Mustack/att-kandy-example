import React from 'react';
import {TextField, RaisedButton, Paper} from 'material-ui';
import styles from './register.css';
import {dispatch} from '../dispatcher';

/**
 * Component to display a registration form.
 */
export default React.createClass({
    render () {
        return (
            <Paper className={styles.registerForm}>
                <div>Please enter your information.</div>
                <TextField hintText="e.g. james.smith" floatingLabelText="Username"
                    onChange={this.createFieldHandler('username')}/>
                <TextField hintText="e.g. James" floatingLabelText="First Name"
                    onChange={this.createFieldHandler('firstName')}/>
                <TextField hintText="e.g. Smith" floatingLabelText="Last Name"
                    onChange={this.createFieldHandler('lastName')}/>
                <TextField hintText="e.g. james.smith@email.com" floatingLabelText="Email"
                    onChange={this.createFieldHandler('email')}/>
                <TextField hintText="e.g. cat123" floatingLabelText="Password" type="password"
                    onChange={this.createFieldHandler('password')}/>
                <div className={styles.buttonContainer}>
                    <RaisedButton label="Done" primary={true} onClick={this.register}/>
                </div>
            </Paper>
        );
    },

    register() {
        // Since the state has the full payload, just use it as is.
        dispatch('registerUser', this.state);
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
