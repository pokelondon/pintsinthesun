import { getLocation } from '../services/location';
import { floorLatLng } from '../services/location';
import { reverseGeocode } from '../services/googlemaps';
import { fetchWeather, filterWeather } from './weather';
import { showDialog, closeDialog } from './ui';
import { normaliseLatLng } from '../utils/pintsUtils';

import config from '../config';

export const UPDATE_TIME = 'update_time';
export const FETCH_POSITION = 'fetch_position';
export const REQUEST_POSITION = 'request_position';
export const RESPONSE_POSITION = 'response_position';

export const SET_POSITION = 'SET_POSITION';

export const REQUEST_PUBS = 'request_pubs';
export const RESPONSE_PUBS = 'response_pubs';
export const REQUEST_PUB_DETAIL = 'request_pub_detail';
export const RESPONSE_PUB_DETAIL = 'response_pub_detail';

export const SET_CURRENT_PUB = 'SET_CURRENT_PUB';
export const FOCUS_ON_PUB_LOCATION = 'FOCUS_ON_PUB_LOCATION';

export const REQUEST_ADDRESS = 'request_address';
export const RESPONSE_ADDRESS = 'response_address';

export const ADD_PUB = 'add_pub';

export const SHOULD_SUGGEST = 'SHOULD_SUGGEST';
export const SUGGEST_PUB = 'SUGGEST_PUB';

export const MAP_ZOOM_CHANGE = 'MAP_ZOOM_CHANGE';

import { hashHistory } from 'react-router'



export function addPub(pubDetails) {
    return function(dispatch) {
        dispatch({
            type: ADD_PUB,
            pubDetails
        });
    }
}

export function requestPosition() {
    return {
        type: REQUEST_POSITION
    }
}

export function responsePosition(centre, isGPSPosition = false) {
    let isRealPosition = true;
    return function(dispatch) {

        if(centre.error){ //user denied location access
            centre = {lat: 51.523661, lng: -0.077338}; //default to shoreditch when no location available 51.523661, -0.077338
            isRealPosition = false;
            isGPSPosition = false;
        }

        dispatch(fetchPubs(centre));
        dispatch(fetchWeather(centre));

        dispatch({
            type: RESPONSE_POSITION,
            centre: centre,
            receivedAt: new Date(),
            isRealPosition,
            isGPSPosition,
            address: null
        });
    }
}

export function setPosition(centre) {
    return {
        type: SET_POSITION,
        centre
    }
}

export function updateTime(date, isNow = false) {

    let hours = date.getHours();
    var timeRange = 'morning';
    if(hours >= 12 && hours < 18){
        timeRange = 'afternoon'
    }
    if(hours > 17 && hours < 24){
        timeRange = 'evening';
    }
    if(isNow){
        timeRange = 'now';
    }

    return function(dispatch) {
        dispatch({
            type: UPDATE_TIME,
            date,
            timeRange
        });
        let hour = date.getHours();
        dispatch(filterWeather(hour));
    }
}

export function fetchPosition() {
    return function(dispatch) {
        // Update UI to show spinner or something
        dispatch(requestPosition());

        return getLocation().then(result => {
            dispatch(responsePosition(result, true));
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

export function requestAddress() {
    return {
        type: REQUEST_ADDRESS
    }
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
    return (dispatch, getState) => {
        dispatch({
            type: RESPONSE_PUBS,
            items: data.items,
            receivedAt: new Date(),
            isLoading: false
        });
        if(getState().position.shouldSuggest) {
            dispatch(suggestPub());
        }
    }
}

export function getAddress(centre) {
    return function (dispatch){
        dispatch(requestAddress());
        reverseGeocode(centre, (result) => {
            if(result.status === 'OK'){
                dispatch(responseAddress(result.address));
            } else {
                dispatch(responseAddress(null));
            }
        });
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

export function responseAddress(address) {
    return {
        type: RESPONSE_ADDRESS,
        address: address
    }
}

export function responsePubDetail(data) {
    return {
        type: RESPONSE_PUB_DETAIL,
        pub: data.pub,
        receivedAt: new Date(),
        isLoading: false
    }
}

export function setCurrentPub(foursquareID, history) {

    return (dispatch, getState) => {
        dispatch({
            type: SET_CURRENT_PUB,
            payload: foursquareID
        });

        const state = getState();
        if(state.position.filteredPubs) {
            const pubObject = state.position.filteredPubs[foursquareID];

            if(pubObject && history) {
                const pubLocation = normaliseLatLng(pubObject.location.coordinates);
                history.push(`/pubs/${pubLocation.lat}/${pubLocation.lng}/${foursquareID}`);
                dispatch({type: FOCUS_ON_PUB_LOCATION});
            }
        }
    }
}

export function focusOnPubLocation() {
    return {
        type: FOCUS_ON_PUB_LOCATION
    }
}

export function shouldSuggest(bool) {
    return {
        type: SHOULD_SUGGEST,
        payload: bool
    }
}

export function suggestPub() {
    return (dispatch) => {
        dispatch({type: SUGGEST_PUB});
        dispatch(focusOnPubLocation());
    }
}

export function changeZoom(zoomLevel) {
    return {
        type: MAP_ZOOM_CHANGE,
        payload: zoomLevel
    }
}

function handleError(err) {
    //hashHistory.push('/error');
    return (dispatch) => {
        dispatch(showDialog('Oops - something went wrong :('));
    }
}
