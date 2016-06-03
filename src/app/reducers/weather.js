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

const filterWeather = (weather, hour) => {
    return weather.sort((prev, curr) => {
        return (Math.abs(curr - hour) < Math.abs(prev - hour) ? curr : prev);
    })[0];
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
                weatherNow: filterWeather(action.data, new Date().getHours()),
                data: action.data
            }
        case FILTER_WEATHER:
            return {
                ...state,
                weatherNow: filterWeather(state.data, action.hour)
            }
        default:
            return state
    }
}
