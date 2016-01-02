import {register} from './dispatcher';
import {login} from './actions/login';
import {registerUser} from './actions/registerUser';
import {sendMessage} from './actions/kandyActions';
import {makeCall, answerCall} from './actions/attActions';

register('login', login);
register('registerUser', registerUser);
register('sendMessage', sendMessage);
register('makeCall', makeCall);
register('answerCall', answerCall);
