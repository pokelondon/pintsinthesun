import SunCalc from '../lib/suncalc';

import {
    UPDATE_TIME,
    FETCH_POSITION,
    REQUEST_POSITION,
    RESPONSE_POSITION,
    REQUEST_PUBS,
    RESPONSE_PUBS,
    REQUEST_PUB_DETAIL,
    RESPONSE_PUB_DETAIL,
    INCREMENT_CURRENT_PUB
} from '../actions/position';

const date = new Date();
const ANGLE_RANGE = 90;
const centre = {lat: 51.54, lng: -0.04};

function getAngleRange(position) {
    var sunAngle = position.azimuth * 180 / Math.PI;
    return [sunAngle - 90 - (ANGLE_RANGE/2), sunAngle - 90 + (ANGLE_RANGE/2)];
}

function filterForAngle(sun, items) {
    let [ min, max ] = getAngleRange(sun);
    const res = items.filter(item => (item.outdoor_angle >= min && item.outdoor_angle <= max));
    return res;
}

const INITIAL_STATE = {
    isLocating: false,
    sun: getAngleRange(SunCalc.getPosition(date, centre.lat, centre.lng)),
    centre,
    date,
    items: [],
    filteredPubs : [],
    isFetching: false,
    currentPub: 0
}

export default function position(state=INITIAL_STATE, action) {
    switch (action.type) {
        case UPDATE_TIME:
            var sun = SunCalc.getPosition(action.date, state.centre.lat, state.centre.lng);
            return {
                ...state,
                date: action.date,
                filteredPubs: filterForAngle(sun, state.items),
                sun
            }
        case RESPONSE_POSITION:
            var sun = SunCalc.getPosition(state.date, action.centre.lat, action.centre.lng);
            return {
                ...state,
                centre: action.centre,
                isLocating: false,
                filteredPubs: filterForAngle(sun, state.items),
                sun
            }
        case REQUEST_POSITION:
            return {
                ...state,
                isLocating: true
            }
        case REQUEST_PUBS:
            return {
                ...state,
                isFetching: true
            }
        case REQUEST_PUB_DETAIL:
            return {
                ...state,
                isFetching: true
            }
        case RESPONSE_PUBS:
            return {
                ...state,
                isFetching: false,
                items: action.items,
                filteredPubs: filterForAngle(state.sun, action.items),
                currentPub: 0
            }
        case RESPONSE_PUB_DETAIL:
            return {
                ...state,
                isFetching: false,
                pub: action.pub
            }
        case INCREMENT_CURRENT_PUB:
            let currentPub = state.currentPub + 1;
            if(currentPub >= state.items.length) {
                currentPub = 0;
            }
            return {
                ...state,
                currentPub
            }
        default:
            return state;
    }
}
