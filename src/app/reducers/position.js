import SunCalc from '../lib/suncalc';

import {
    UPDATE_TIME,
    FETCH_POSITION,
    REQUEST_POSITION,
    RESPONSE_POSITION
} from '../actions/position';

const date = new Date();
const ANGLE_RANGE = 90;
const centre = {lat: 51.54, lng: -0.04};

function getAngleRange(position) {
    var sunAngle = position.azimuth * 180 / Math.PI;
    return [sunAngle - 90 - (ANGLE_RANGE/2), sunAngle - 90 + (ANGLE_RANGE/2)];
}

const INITIAL_STATE = {
    isLocating: false,
    sun: getAngleRange(SunCalc.getPosition(date, centre.lat, centre.lng)),
    centre,
    date
}

export default function position(state=INITIAL_STATE, action) {
    switch (action.type) {
        case UPDATE_TIME:
            var sun = SunCalc.getPosition(action.date, state.centre.lat, state.centre.lng);
            return {
                ...state,
                date: action.date,
                angleRange: getAngleRange(sun),
                sun
            }
        case RESPONSE_POSITION:
            var sun = SunCalc.getPosition(state.date, action.centre.lat, action.centre.lng);
            return {
                ...state,
                centre: action.centre,
                isLocating: false,
                angleRange: getAngleRange(sun),
                sun
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
