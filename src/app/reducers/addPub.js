import { testIsPub } from '../utils/pintsUtils';
import {
    SEARCH_PUB,
    RECEIVE_SEARCH_PUB_RESULTS,
    MOVE_SELECTED_SEARCH_RESULT,
    SET_SELECTED_SEARCH_RESULT,
    RECEIVE_PUB_DETAILS,
    FOCUS_ON_LOCATION_BY_KEY,
    CHANGE_PUB_DETAIL,
    PUB_SAVED,
    RESET_SEARCH_FORM,
    FOCUS_ON_SEARCH_INPUT,
    SET_SEARCH_IS_ACTIVE,
    RECEIVE_EXISTING_PUBS,
    FILTER_EXISTING_PUBS,
} from '../actions/addPub';

const INITIAL_STATE = {
    searchTerm: '',
    searchResults: null,
    existingPubs: [],
    selectedSearchResultIndex: -1,

    placeID: null,
    locationIsPub: false,
    hasOutsideSpace: false,
    hasGarden: false,

    isSaved: false,
    isSearchActive: false,
}


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SEARCH_PUB:
            return {
                ...state,
                searchTerm: action.searchTerm
            }

        case RECEIVE_SEARCH_PUB_RESULTS:
            return {
                ...state,
                searchResults: action.searchResults.map((result) => {
                    return {
                        place_id: result.place_id,
                        types: result.types.slice(),
                        description: result.description,
                        alreadyExists: state.existingPubs.indexOf(result.place_id) !== -1
                    }
                })
            }

        case MOVE_SELECTED_SEARCH_RESULT:
            return {
                ...state,
                selectedSearchResultIndex: state.selectedSearchResultIndex + action.direction
            }

        case SET_SELECTED_SEARCH_RESULT:
            return {
                ...state,
                selectedSearchResultIndex: action.index
            }

        case FOCUS_ON_LOCATION_BY_KEY:
            return {
                ...state,

            }

        case RECEIVE_PUB_DETAILS:
            return {
                ...state,
                locationLat: action.details.geometry.location.lat(),
                locationLng: action.details.geometry.location.lng(),
                placeID: action.details.place_id,
                placeName: action.details.name,
                locationIsPub: testIsPub(action.details.types),
                hasGarden: false,
                hasOutsideSpace: false
            }

        case CHANGE_PUB_DETAIL:
            return {
                ...state,
                [action.key]: action.val
            }

        case PUB_SAVED:
            return {
                ...state,
                isSaved: action.success,
                isError: !action.success
            }

        case RESET_SEARCH_FORM:
            return INITIAL_STATE

        case SET_SEARCH_IS_ACTIVE:
            return {
                ...state,
                isSearchActive: action.value
            }

        case FOCUS_ON_SEARCH_INPUT:
            return {
                ...state,
                isSearchActive: true
            }

        case RECEIVE_EXISTING_PUBS:
            //merge existing pubs from the XHR call into our state (if they arent in already)
            return {
                ...state,
                existingPubs: [
                    ...state.existingPubs,
                    ...action.existingPubs.filter((newExistingPub) => {
                        return state.existingPubs.indexOf(newExistingPub) === -1;
                    })
                ]
            }

        case FILTER_EXISTING_PUBS:
            return {
                ...state,
                searchResults: state.searchResults.map((result) => {
                    return {
                        ...result,
                        alreadyExists: state.existingPubs.some((existingPub) => {
                            return existingPub === result.place_id
                        })
                    }
                })
            }

        default:
            return state;
    }
}