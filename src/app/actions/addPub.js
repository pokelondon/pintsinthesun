import { searchPubs, getLocationData } from '../services/googlemaps';
import { savePub as savePubAPI, getPub, checkPubsExist } from '../services/pintsinthesun';
import { setPosition } from './position';
import { showDialog } from './ui';

export const SEARCH_PUB = 'SEARCH_PUB';
export const RECEIVE_SEARCH_PUB_RESULTS = 'RECEIVE_SEARCH_PUB_RESULTS';
export const MOVE_SELECTED_SEARCH_RESULT = 'MOVE_SELECTED_SEARCH_RESULT';
export const SET_SELECTED_SEARCH_RESULT = 'SET_SELECTED_SEARCH_RESULT';
export const RECEIVE_PUB_DETAILS = 'RECEIVE_PUB_DETAILS';
export const FOCUS_ON_LOCATION_BY_KEY = 'FOCUS_ON_LOCATION_BY_KEY';
export const CHANGE_PUB_DETAIL = 'CHANGE_PUB_DETAIL';
export const PUB_SAVED = 'PUB_SAVED';
export const RESET_SEARCH_FORM = 'RESET_SEARCH_FORM';
export const SET_SEARCH_IS_ACTIVE = 'SET_SEARCH_IS_ACTIVE';
export const FOCUS_ON_SEARCH_INPUT = 'FOCUS_ON_SEARCH_INPUT';
export const RECEIVE_EXISTING_PUBS = 'RECEIVE_EXISTING_PUBS';
export const FILTER_EXISTING_PUBS = 'FILTER_EXISTING_PUBS';

export const searchPub = (searchTerm) => {
    return {
        type: SEARCH_PUB,
        searchTerm
    }
}

export const fetchSearchPubResults = (searchTerm, bounds) => {
    return (dispatch) => {
        searchPubs(searchTerm, bounds, (results) => {
            dispatch(receiveSearchPubResults(results));
            dispatch(fetchExistingPubs(results));
        });
    }
}

export const receiveSearchPubResults = (searchResults) => {
    return {
        type: RECEIVE_SEARCH_PUB_RESULTS,
        searchResults
    }
}

export const moveSelectedSearchResult = (direction) => {
    return {
        type: MOVE_SELECTED_SEARCH_RESULT,
        direction
    }
}

export const setSelectedSearchResult = (index) => {
    return {
        type: SET_SELECTED_SEARCH_RESULT,
        index
    }
}


/**
* Focus on the location that is currently selected
*/
export const focusOnLocationByKey = () => {
    return (dispatch, getState) => {
        const selectedSearchResultIndex = getState().addPub.selectedSearchResultIndex;
        if(selectedSearchResultIndex >= 0) {
            const searchResults = getState().addPub.searchResults;
            dispatch(focusOnLocation(searchResults[selectedSearchResultIndex].place_id));
        }
    }
}


/**
* Focus on a given location
*/
export const focusOnLocation = (placeID) => {
    return (dispatch) => {
        //check if its in the DB already
        getPub(placeID)
            .then((result) => {
                return result.json();
            })
            .then((data) => {
                //its not - find out more about the place and the focus the map on it
                if(!data.pub) {
                    getLocationData(placeID, null, (result) => {
                        dispatch(receivePubDetails(result));
                    });
                } else {
                    dispatch(showDialog('That pub has already been suggested!'));
                }

            })
            .catch((err) => {
                dispatch(showDialog('Something went wrong :('));
            });

        dispatch(setSearchIsActive(false));
    }
}

export const receivePubDetails = (details) => {
    return (dispatch) => {
        //set the global position
        dispatch(setPosition({
            lat: details.geometry.location.lat(),
            lng: details.geometry.location.lng()
        }));

        dispatch({
            type: RECEIVE_PUB_DETAILS,
            details
        });
    }
}

export const changePubDetail = (key, val) => {
    return {
        type: CHANGE_PUB_DETAIL,
        key,
        val
    }
}

export const savePub = () => {
    return (dispatch, getState) => {
        const state = getState().addPub;
        const details = {
            hasGarden: state.hasGarden,
            hasOutsideSpace: state.hasOutsideSpace
        }
        savePubAPI(state.placeID, details)
            .then(() => {
                dispatch(pubSaved(true))
            })
            .catch(() => {
                dispatch(pubSaved(false))
            });
    }
}

export const pubSaved = (success) => {
    return {
        type: PUB_SAVED,
        success
    }
}

export const resetForm = () => {
    return {
        type: RESET_SEARCH_FORM
    }
}

export const focusOnSearchInput = () => {
    return {
        type: FOCUS_ON_SEARCH_INPUT
    }
}

export const setSearchIsActive = (value) => {
    return {
        type: SET_SEARCH_IS_ACTIVE,
        value
    }
}


/**
* Take the placeIDs of the search results, and fetch a list of pub objects
* that are already in the DB to see if they exist already.
* Debounced to limit server hit.
*/
export const fetchExistingPubs = (searchResults) => {
    const thunk = (dispatch, getState) => {

        const placeIDs = searchResults.map((result) => {
            return result.place_id;
        });

        checkPubsExist(placeIDs)
            .then((existingPubs) => {
                dispatch(receiveExistingPubs(existingPubs));
                dispatch(filterExistingPubs())
            })
            .catch((err) => {
                //TODO - handle error
            });
    }

    thunk.meta = {
        debounce: {
            time: 300,
            key: 'DEBOUNCE_EXISTING_PUBS'
        }
    }

    return thunk;
}


/**
* Receive the pubs that already exist in the DB
*/
export const receiveExistingPubs = (existingPubs) => {
    return {
        type: RECEIVE_EXISTING_PUBS,
        existingPubs
    }
}

/**
* Separate action to merge the existing pub data into the current search results
*/
export const filterExistingPubs = () => {
    return {
        type: FILTER_EXISTING_PUBS
    }
}