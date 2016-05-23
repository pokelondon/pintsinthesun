import React from 'react';

import config from './config';
import { floorLatLng } from './location';

export const MORNING = 1;
export const AFTERNOON = 2;
export const EVENING = 3;

/**
 * @returns Promise
 */
export function getSuggestions(timeofday, centre) {
    let { lat, lng } = floorLatLng(centre);
    const url = config.API + 'results.json';
    return fetch(url).then(data => data.json());
}

