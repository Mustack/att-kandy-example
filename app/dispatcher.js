import Emitter from 'emmett';
var emitter = new Emitter();

export function dispatch(action, payload ){
    emitter.emit(action, payload);
}

export function register(action, actionHandler) {
    emitter.on(action, event => actionHandler(event.data));
}
