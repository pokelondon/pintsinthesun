import { geocode as geocodeApi } from '../services/googlemaps.js';
import { showDialog } from './ui';

export const GEOCODE_START = 'GEOCODE_START';
export const GEOCODE_SUCCESS = 'GEOCODE_SUCCESS';
export const GEOCODE_FAILURE = 'GEOCODE_FAILURE';
export const GEOCODE_ZERO_RESULTS = 'GEOCODE_ZERO_RESULTS';

export const geocodeSearch = (searchTerm, mapBounds) => {
    return (dispatch) => {
        dispatch({type: GEOCODE_START});
        geocodeApi(searchTerm, mapBounds, (result) => {
            if(result.status === 'OK'){
                dispatch(geocodeSuccess(result.centre));
            } else
            if(result.status == 'ZERO_RESULTS')
                dispatch(geocodeZeroResults());
            else {
                dispatch(geocodeFailure());
            }
        });
    }
}

export const geocodeSuccess = (centre) => {
    return {
        type: GEOCODE_SUCCESS,
        payload: centre
    }
}

export const geocodeFailure = () => {
    return (dispatch) => {
        dispatch(showDialog('Oops, something went wrong :( Please try again in a bit.'));
        dispatch({type: GEOCODE_FAILURE});
    }
}

export const geocodeZeroResults = () => {
    return {
        type: GEOCODE_ZERO_RESULTS
    }
}
