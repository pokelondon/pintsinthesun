import { getLocation } from '../services/location';


export const UPDATE_TIME = 'update_time';

export const FETCH_POSITION = 'fetch_position';
export const REQUEST_POSITION = 'request_position';
export const RESPONSE_POSITION = 'response_position';


export function requestPosition() {
    return {
        type: REQUEST_POSITION
    }
}

export function responsePosition(centre) {
    return {
        type: RESPONSE_POSITION,
        centre: centre,
        receivedAt: new Date()
    }
}

export function updateTime(date) {
    return {
        type: UPDATE_TIME,
        date
    }
}

export function fetchPosition() {
    return function(dispatch) {
        // Update UI to show spinner or something
        dispatch(requestPosition());

        return getLocation().then(centre => dispatch(responsePosition(centre)));
    }
}
