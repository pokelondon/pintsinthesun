import config from '../config';

export function geocode(term) {
    return fetch(config.MAPBOX_GEOCODING_API.replace('{term}', term), {
        method: 'get'
    });
}