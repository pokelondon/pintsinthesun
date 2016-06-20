import config from '../config';
import {addLocation as addLocationToLocal} from './local';

// import promise from 'es6-promise';
// import 'isomorphic-fetch';
// promise.polyfill();

export function savePub(locationID, pubDetails) {

    console.log('pubDetails (which is state)', pubDetails);

    const payload = {
        outdoor_angle: pubDetails.outdoorAngle,
        has_terrace: pubDetails.hasTerrace,
        has_garden: pubDetails.hasGarden,
        is_isolated: pubDetails.isIsolated,
        is_on_hill: pubDetails.isOnHill,
        is_in_park: pubDetails.isInPark,
        building_to_the_west: pubDetails.buildingToTheWest,

    };

    console.log('payload', payload);

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
