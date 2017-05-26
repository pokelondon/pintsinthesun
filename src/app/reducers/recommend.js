import {
    RECOMMEND_PUB_START,
    RECOMMEND_PUB_SUCCESS,
    RECOMMEND_PUB_FAILURE
} from '../actions/recommend';

const INITIAL_STATE = {
    isRecommending: false,
    alreadyRecommended: []
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case RECOMMEND_PUB_START:
            return {
                ...state,
                isRecommending: true
            }
        case RECOMMEND_PUB_SUCCESS:
            return {
                ...state,
                isRecommending: false,
                alreadyRecommended: [...state.alreadyRecommended, action.foursquareID]
            }
        case RECOMMEND_PUB_FAILURE:
            return {
                ...state,
                isRecommending: false,
                error: action.error
            }
        default:
            return state;

    }
}