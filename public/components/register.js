import React from 'react';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import AutoComplete from 'material-ui/lib/auto-complete';

export default React.createClass({
    render() {
        return (
            <form>
                <TextField hintText="e.g. James" floatingLabelText="First Name" />
                <TextField hintText="e.g. Smith" floatingLabelText="Last Name" />
                <TextField hintText="e.g. james.smith@email.com" floatingLabelText="Email"/>
                <AutoComplete floatingLabelText = "Country" dataSource = {["12345", "23456", "34567"]} />
                <TextField hintText="e.g. cat123" floatingLabelText="Password" type="password" />
                <RaisedButton label="Login" primary={true}/>
                
            </form>
        );
    }
});
