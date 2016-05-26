import SunCalc from '../lib/suncalc';

import {
    UPDATE_TIME,
    FETCH_POSITION,
    REQUEST_POSITION,
    RESPONSE_POSITION
} from '../actions/position';

const date = new Date();
date.setHours(14);

const INITIAL_STATE = {
    centre: {lat: 51.54, lng: -0.04},
    date,
    isLocating: false
}

export default function position(state=INITIAL_STATE, action) {
    switch (action.type) {
        case UPDATE_TIME:
            return {
                ...state,
                date: action.date,
                sun: SunCalc.getPosition(action.date, state.centre.lat, state.centre.lng)
            }
        case RESPONSE_POSITION:
            return {
                ...state,
                centre: action.centre,
                isLocating: false,
                sun: SunCalc.getPosition(state.date, action.centre.lat, action.centre.lng)
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
