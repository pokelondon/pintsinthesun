import {
    AUTH_USER,
} from '../actions/user';

const INITIAL_STATE = {
    isAuthed: false
}

export default function user(state=INITIAL_STATE, action) {

    switch (action.type) {
        case AUTH_USER:
            return {
                ...state,
                isAuthed: true
            }
        default:
            return state;
    }
}

