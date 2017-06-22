import {
    SHOW_DIALOG,
    CLOSE_DIALOG,
    LAUNCH_INFO_MODAL,
    CLOSE_MODAL,
    HIDE_SLIDER_TIP,
} from '../actions/ui';


const INITIAL_STATE = {
    dialogVisible: false,
    modal: null,
    isSliderTipVisible: true,
    dialogMessage: '',
    dialogMoreInfo: ''
}

export default function ui(state = INITIAL_STATE, action) {
    switch(action.type) {
        case SHOW_DIALOG :
            return {
                ...state,
                dialogVisible: true,
                dialogMessage: action.payload.message,
                dialogMoreInfo: action.payload.moreInfo,
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
        case HIDE_SLIDER_TIP:
            return {
                ...state,
                isSliderTipVisible: false
            }
        default:
            return state;
    }
}