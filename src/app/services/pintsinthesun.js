import config from '../config';
import {addLocation as addLocationToLocal} from './local';

// import promise from 'es6-promise';
// import 'isomorphic-fetch';
// promise.polyfill();

export function savePub(locationID, hasTerrace, buildingToTheWest, angle) {

    const payload = {
        outdoor_angle: angle,
        has_terrace: hasTerrace,
        building_to_the_west: buildingToTheWest
    };

    const data = JSON.stringify(payload);

    return fetch(`${config.API}pub/${locationID}`, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    });

}


/**
 * Returns list of locations that are in the database
 *
 * @param {Array} ids - array of place IDs we want to check
 */
export function checkPubsExist(ids) {

    const data = JSON.stringify(ids);

    return fetch(`${config.API}pub/exists/`, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    }).then(
        data => data.json()
    );

}
