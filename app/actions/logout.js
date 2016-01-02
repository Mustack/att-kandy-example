import {logout as attLogout} from './attActions';
import {logout as kandyLogout} from './kandyActions';

export function logout() {
    return Promise.all([attLogout(), kandyLogout()]);
}
