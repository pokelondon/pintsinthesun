import React from 'react';

import config from './config';


/**
 * Get pubs around a certain location
 * @param centre Object {lat, lng}
 * @returns Promise
 */
export function getPubs(centre) {
    const lat = Math.floor(centre.lat * config.FS_PRECISION) / config.FS_PRECISION;
    const lng = Math.floor(centre.lng * config.FS_PRECISION) / config.FS_PRECISION;
    const url = config.FOURSQUARE_URL + `&ll=${lat}%2C${lng}`;
    return fetch(url).then(data => data.json()).then(data=> data.response.venues);
}
