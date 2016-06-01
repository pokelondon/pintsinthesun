import { getLocation } from '../services/location';
import { floorLatLng } from '../services/location';

import config from '../config';



export const UPDATE_TIME = 'update_time';
export const FETCH_POSITION = 'fetch_position';
export const REQUEST_POSITION = 'request_position';
export const RESPONSE_POSITION = 'response_position';

export const FILTER_PUBS = 'filter_pubs';
export const REQUEST_PUBS = 'request_pubs';
export const RESPONSE_PUBS = 'response_pubs';


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

/**
 * @returns Promise
 */
export function getSuggestions(date, centre) {
    let { lat, lng } = floorLatLng(centre);
    const url = config.API + `near/${lat}/${lng}/${date.toISOString()}`;
    return fetch(url).then(data => data.json());
}

export function requestPubs() {
    return {
        type: REQUEST_PUBS,
        isLoading: true
    }
}

export function responsePubs(data) {
    return {
        type: RESPONSE_PUBS,
        items: data.items,
        receivedAt: new Date(),
        isLoading: false
    }
}

export function fetchPubs(date, centre) {
    return function(dispatch) {
        dispatch(requestPubs());
        let { lat, lng } = floorLatLng(centre);
        const url = config.API + `near/${lat}/${lng}`;
        return fetch(url)
            .then(data => data.json())
            .then(data => {
                dispatch(responsePubs(data));
            });
            // TODO handle promise error in UI too
    };
}

export function filterPubs() {
    return {
        type: FILTER_PUBS
    }
}
