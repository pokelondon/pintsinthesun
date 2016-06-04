import config from '../config';

export const FETCH_WEATHER = 'fetch_weather';
export const REQUEST_WEATHER = 'request_weather';
export const RESPONSE_WEATHER = 'response_weather';
export const FILTER_WEATHER = 'filter_weather';


export function requestWeather() {
    return {
        type: REQUEST_WEATHER,
        isFetching: true
    }
}

export function fetchWeather(centre) {
    let { lat, lng } = centre;
    lat = lat.toFixed(2);
    lng = lng.toFixed(2);
    return function(dispatch) {
        dispatch(requestWeather());
        const url = `/weather/${lat}/${lng}`;
        return fetch(url)
            .then(data => data.json())
            .then(data => {
                dispatch(responseWeather(data));
            });
    };
}

export function responseWeather(data) {
    return {
        data,
        type: RESPONSE_WEATHER,
        receivedAt: new Date(),
        isFetching: false
    }
}

export function filterWeather(hour) {
    return {
        type: FILTER_WEATHER,
        hour
    }
}
