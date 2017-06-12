import { searchPubName as searchPubName } from '../services/foursquare.js';
import { showDialog } from './ui';

export const PUB_NAME_SEARCH_START = 'PUB_NAME_SEARCH_START';
export const PUB_NAME_SEARCH_SUCCESS = 'PUB_NAME_SEARCH_SUCCESS';
export const PUB_NAME_SEARCH_FAILURE = 'PUB_NAME_SEARCH_FAILURE';

export const doSearch = (term, near, centre) => {
    return (dispatch, getState) => {
        dispatch({type: PUB_NAME_SEARCH_START});
        // geocodeApi(searchTerm, mapBounds, (result) => {
        //     if(result.status === 'OK'){
        //         dispatch(geocodeSuccess(result.centre));
        //     } else
        //     if(result.status == 'ZERO_RESULTS')
        //         dispatch(geocodeZeroResults());
        //     else {
        //         dispatch(geocodeFailure());
        //     }
        // });
        searchPubName(term, near, getState().position.centre)
            .then((results) => {
                searchSuccess(results);
            })
            .catch((err) => {
                searchFailure();
            });
    }
}

export const searchSuccess = (results) => {
    return {
        type: PUB_NAME_SEARCH_SUCCESS,
        payload: results
    }
}

export const searchFailure = () => {
    return (dispatch) => {
        dispatch(showDialog('Oops, something went wrong :( Please try again in a bit.'));
        dispatch({type: PUB_NAME_SEARCH_FAILURE});
    }
}
