import { geocode as geocodeApi } from '../services/mapbox';
import { showDialog } from './ui';
import { fetchPubs } from './position';
import { fetchWeather } from './weather';
import { normaliseLatLng } from '../utils/pintsUtils';

export const GEOCODE_START = 'GEOCODE_START';
export const GEOCODE_SUCCESS = 'GEOCODE_SUCCESS';
export const GEOCODE_FAILURE = 'GEOCODE_FAILURE';
export const GEOCODE_ZERO_RESULTS = 'GEOCODE_ZERO_RESULTS';

export const geocodeSearch = (searchTerm, mapBounds) => {
    return (dispatch) => {
        dispatch({type: GEOCODE_START});
        geocodeApi(searchTerm).then((response) => {
            return response.json();
        })
        .then((results) => {
            if(results.features.length === 0) {
                dispatch(geocodeZeroResults());
            } else {
                const centre = normaliseLatLng(results.features[0].geometry.coordinates);
                dispatch(geocodeSuccess(centre));
            }

        })
        .catch((err) => {
            dispatch(geocodeFailure(err));
        });
    }
}

export const geocodeSuccess = (centre) => {
    return (dispatch) => {
        dispatch({
            type: GEOCODE_SUCCESS,
            payload: centre
        });
        dispatch(fetchPubs(centre));
        dispatch(fetchWeather(centre));
    }
}

export const geocodeFailure = (err) => {
    return (dispatch) => {
        dispatch(showDialog('Oops, something went wrong :( Please try again in a bit.', String(err)));
        dispatch({type: GEOCODE_FAILURE});
    }
}

export const geocodeZeroResults = () => {
    return {
        type: GEOCODE_ZERO_RESULTS
    }
}
