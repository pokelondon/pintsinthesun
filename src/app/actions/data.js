import config from '../config';
import { floorLatLng } from '../services/location';

export const REQUEST_PUBS = 'request_pubs';
export const RESPONSE_PUBS = 'response_pubs';

/**
 * @returns Promise
 */
export function getSuggestions(date, centre) {
    let { lat, lng } = floorLatLng(centre);
    const url = config.API + `near/${lat}/${lng}/${date.toISOString()}`;
    return fetch(url).then(data => data.json());
}


export function requestPubs() {
    return {
        type: REQUEST_PUBS,
        isLoading: true
    }
}

export function responsePubs(data) {
    return {
        type: RESPONSE_PUBS,
        items: data.items,
        receivedAt: new Date(),
        isLoading: false
    }
}

export function fetchPubs(date, centre) {

    // Returns a function
    // When called the callable is passed the dispatch function
    // so it too, can dispatch other actions, like for updating status etc.
    return function(dispatch) {

        // First, let the UI know this is starting
        dispatch(requestPubs());

        // The function called by the thunk middleware can return a value,
        // that is passed on as the return value of the dispatch method.

        // In this case, we return a promise to wait for.
        // This is not required by thunk middleware, but it is convenient for us.

        let { lat, lng } = floorLatLng(centre);
        const url = config.API + `near/${lat}/${lng}`;

        return fetch(url)
            .then(data => data.json())
            .then(data => {
                // We can dispatch many times!
                // Here, we update the app state with the results of the API call.

                // Update state by triggering FEED_RESPONSE action
                dispatch(responsePubs(data));
            });
            // TODO handle promise error in UI too
    };
}
