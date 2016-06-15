import { getLocation } from '../services/location';
import { floorLatLng } from '../services/location';
import { fetchWeather, filterWeather } from './weather';

import config from '../config';

export const UPDATE_TIME = 'update_time';
export const FETCH_POSITION = 'fetch_position';
export const REQUEST_POSITION = 'request_position';
export const RESPONSE_POSITION = 'response_position';

export const REQUEST_PUBS = 'request_pubs';
export const RESPONSE_PUBS = 'response_pubs';
export const REQUEST_PUB_DETAIL = 'request_pub_detail';
export const RESPONSE_PUB_DETAIL = 'response_pub_detail';

export const INCREMENT_CURRENT_PUB = 'increment_current_pub';

import { hashHistory } from 'react-router'



export function requestPosition() {
    return {
        type: REQUEST_POSITION
    }
}

export function responsePosition(centre) {
    return function(dispatch) {
        dispatch(fetchPubs(centre));
        dispatch(fetchWeather(centre));
        dispatch({
            type: RESPONSE_POSITION,
            centre: centre,
            receivedAt: new Date()
        });
    }
}

export function updateTime(date) {
    return function(dispatch) {
        dispatch({
            type: UPDATE_TIME,
            date
        });
        let hour = date.getHours();
        dispatch(filterWeather(hour));
    }
}

export function fetchPosition() {
    return function(dispatch) {
        // Update UI to show spinner or something
        dispatch(requestPosition());

        return getLocation().then(centre => {
            dispatch(responsePosition(centre));
        });
    }
}

/**
 * @returns Promise
 */
export function getSuggestions(date, centre) {
    let { lat, lng } = floorLatLng(centre);
    const url = config.API + `near/${lat}/${lng}/${date.toISOString()}`;
    return fetch(url).then(
        data => data.json()).catch( handleError );
}

export function requestPubs() {
    return {
        type: REQUEST_PUBS,
        isLoading: true
    }
}
export function requestPubDetail() {
    return {
        type: REQUEST_PUB_DETAIL,
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

export function fetchPubs(centre) {
    return function(dispatch) {
        dispatch(requestPubs());
        let { lat, lng } = floorLatLng(centre);
        const url = config.API + `near/${lat}/${lng}`;
        return fetch(url)
            .then(data => data.json())
            .then(data => {
                dispatch(responsePubs(data));
            }).catch( handleError );

    };
}

export function fetchPubDetail(id) {
    return function(dispatch) {
        dispatch(requestPubDetail());
        const url = config.API + `pub/${id}`;
        return fetch(url)
            .then(data => data.json())
            .then(data => {
                dispatch(responsePubDetail(data));
            }).catch( handleError );
    };
}

export function responsePubDetail(data) {
    return {
        type: RESPONSE_PUB_DETAIL,
        pub: data.pub,
        receivedAt: new Date(),
        isLoading: false
    }
}

export function incrementCurrentPub() {
    return {
        type: INCREMENT_CURRENT_PUB
    }
}

function handleError(err) {
    hashHistory.push('/error');
}
