import {
    GEOCODE_START,
    GEOCODE_SUCCESS,
    GEOCODE_FAILURE,
    GEOCODE_ZERO_RESULTS
} from '../actions/geocode';

const INITIAL_STATE = {
    isGeocoding: false,
    hasError: false,
    hasZeroResults: false,
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case GEOCODE_START:
            return {
                ...state,
                isGeocoding: true,
                hasError: false,
                hasZeroResults: false
            }
        case GEOCODE_SUCCESS:
            return {
                ...state,
                isGeocoding: false
            }
        case GEOCODE_FAILURE:
            return {
                ...state,
                isGeocoding: false,
                hasError: true
            }
        case GEOCODE_ZERO_RESULTS:
            return {
                ...state,
                isGeocoding: false,
                hasError: false,
                hasZeroResults: true
            }
        default:
            return state;
    }
}