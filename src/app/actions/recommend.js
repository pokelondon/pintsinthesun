import { savePub } from '../services/pintsinthesun';
import { showDialog } from './ui';

export const RECOMMEND_PUB_START = 'RECOMMEND_PUB_START';
export const RECOMMEND_PUB_SUCCESS = 'RECOMMEND_PUB_SUCCESS';
export const RECOMMEND_PUB_FAILURE = 'RECOMMEND_PUB_FAILURE';

export const recommendPub = (foursquareID, attributes) => {
    return (dispatch) => {
        dispatch({type: RECOMMEND_PUB_START});
        savePub(foursquareID, attributes).then((response) => {
            if(response.status === 429) {
                dispatch(showDialog('Whoa there - bit too quick with the ol recommendations...'));
                dispatch({type: RECOMMEND_PUB_FAILURE});
            } else {
                dispatch(recommendPubSuccess(foursquareID));
            }
        }).catch((err) => {
            dispatch(recommendPubFailure());
        })
    }
}

export const recommendPubSuccess = (foursquareID) => {
    return {
        type: RECOMMEND_PUB_SUCCESS,
        foursquareID
    }
}

export const recommendPubFailure = () => {
    return (dispatch) => {
        dispatch(showDialog('Oops, something went wrong :( Please try again in a bit.'));
        dispatch({type: RECOMMEND_PUB_FAILURE});
    }
}