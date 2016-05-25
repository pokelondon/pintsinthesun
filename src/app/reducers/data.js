import { REQUEST_PUBS, RESPONSE_PUBS } from '../actions/data';

const INITIAL_STATE = {
    items: [],
    isFetching: false
}

export default function data(state=INITIAL_STATE, action) {
    switch (action.type) {
        case REQUEST_PUBS:
            return {
                ...state,
                isFetching: true
            }
        case RESPONSE_PUBS:
            return {
                ...state,
                isFetching: false,
                items: action.items
            }
        default:
            return state;
    }
}

