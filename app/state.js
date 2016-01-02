import Baobab from 'baobab';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default new Baobab({
    user: {
        loggedIn: Baobab.dynamicNode(
            ['kandy', 'loggedIn'],
            ['att', 'loggedIn'],
            (kandyLoggedIn, attLoggedIn) => kandyLoggedIn && attLoggedIn
        ),
        progress: false
    },
    kandy: {
        loggedIn: false,
        initialized: false
    },
    att: {
        loggedIn: false
    },
    conversations: [],
    errors: []
}, {
    shiftReferences: true,
    mixins: [PureRenderMixin]
});
