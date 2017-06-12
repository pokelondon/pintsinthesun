import {
    PUB_NAME_SEARCH_START,
    PUB_NAME_SEARCH_SUCCESS,
    PUB_NAME_SEARCH_FAILURE
} from '../actions/pubNameSearch';

const INITIAL_STATE = {
    isSearching: false,
    hasError: false,
    results: [],
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case PUB_NAME_SEARCH_START:
            return {
                ...state,
                isSearching: true
            }
        case PUB_NAME_SEARCH_SUCCESS:
            return {
                ...state,
                isSearching: false,
                results: action.payload
            }
        case PUB_NAME_SEARCH_FAILURE:
            return {
                ...state,
                isSearching: false,
                hasError: true
            }
        default:
            return state;
    }
}