import Baobab from 'baobab';
import ReactAddons from 'react/addons';

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
        loggedIn: false
    },
    att: {
        loggedIn: false
    },
    conversations: [],
    errors: []
}, {
    shiftReferences: true,
    mixins: [ReactAddons.addons.PureRenderMixin]
});
