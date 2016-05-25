import {
    UPDATE_TIME,
    FETCH_POSITION,
    REQUEST_POSITION,
    RESPONSE_POSITION
} from '../actions/position';

const date = new Date();
date.setHours(14);

const INITIAL_STATE = {
    centre: {lat: 51.6, lng: -0.1},
    date,
    isLocating: false
}

export default function position(state=INITIAL_STATE, action) {
    switch (action.type) {
        case UPDATE_TIME:
            return {
                ...state,
                centre: action.date
            }
        case RESPONSE_POSITION:
            return {
                ...state,
                centre: action.centre,
                isLocating: false
            }

        case REQUEST_POSITION:
            return {
                ...state,
                isLocating: true
            }
        default:
            return state;
    }
}
