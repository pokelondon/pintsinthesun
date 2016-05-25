import {
    UPDATE_ANGLE,
} from '../actions/locate';

const INITIAL_STATE = {
    angle: -10
}

export default function locate(state=INITIAL_STATE, action) {
    switch (action.type) {
        case UPDATE_ANGLE:
            return {
                ...state,
                angle: action.angle
            }
        default:
            return state;
    }
}

