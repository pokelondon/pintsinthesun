import React from 'react';

import config from '../config';

import { floorLatLng } from './location';

// import promise from 'es6-promise';
// import 'isomorphic-fetch';
// promise.polyfill();


/**
 * Get pubs around a certain location
 * @param {Object} centre
 * @returns Promise
 */
export function getPubs(centre) {
    let { lat, lng } = floorLatLng(centre);
    const url = config.FOURSQUARE_URL + `&ll=${lat}%2C${lng}`;
    return fetch(url)
        .then(data => data.json())
        .then(data => data.response.venues);
}


/**
 * Get pubs matching a search term and location
 * @param {string} term - search term
 * @param {string} near - near location
 * @param {Object} centre - map centre
 * @returns Promise
 */
export function searchPubName(term, near, centre) {
    let { lat, lng } = floorLatLng(centre);
    const url = config.FOURSQUARE_URL + `&ll=${lat}%2C${lng}&query=${encodeURIComponent(term)}&near=${encodeURIComponent(near)}`;

    return fetch(url)
        .then(data => data.json())
        .then(data => data.response.venues);
}