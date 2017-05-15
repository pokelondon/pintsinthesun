import {
    SHOW_DIALOG,
    CLOSE_DIALOG,
    LAUNCH_INFO_MODAL,
    CLOSE_MODAL,
} from '../actions/ui';


const INITIAL_STATE = {
    dialogVisible: false,
    modal: null
}

export default function ui(state = INITIAL_STATE, action) {
    switch(action.type) {
        case SHOW_DIALOG :
            return {
                ...state,
                dialogVisible: true,
                dialogMessage: action.message
            }

        case CLOSE_DIALOG :
            return {
                ...state,
                dialogVisible: false
            }

        case LAUNCH_INFO_MODAL:
            return {
                ...state,
                modal: 'info'
            }

        case CLOSE_MODAL:
            return {
                ...state,
                modal: null
            }

        default:
            return state;
    }
}