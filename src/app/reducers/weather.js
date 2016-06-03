import {
    FETCH_WEATHER,
    REQUEST_WEATHER,
    RESPONSE_WEATHER,
    FILTER_WEATHER
} from '../actions/weather';

const INITIAL_STATE = {
    data: [],
    isFetching: false,
    receivedAt: null,
    weatherNow: {}
}

const nearestPrognosis = (weather, hour) => {
    if(Date === typeof hour) {
        hour = hour.getHours();
    }
    weather.sort((prev, curr) => {
        return (Math.abs(curr.hour - hour) < Math.abs(prev.hour - hour) ? curr.hour : prev.hour);
    });
    return weather[0];
}

export default function weather(state=INITIAL_STATE, action) {
    switch(action.type) {
        case REQUEST_WEATHER:
            return {
                ...state,
                isFetching: true
            }
        case RESPONSE_WEATHER:
            return {
                ...state,
                isFetching: false,
                weatherNow: nearestPrognosis(action.data, new Date().getHours()),
                data: action.data
            }
        case FILTER_WEATHER:
            return {
                ...state,
                weatherNow: nearestPrognosis(state.data, action.hour)
            }
        default:
            return state
    }
}
