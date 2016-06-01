import config from '../config';
import {addLocation as addLocationToLocal} from './local';

/**
 * Save pub to the API
 * Also (for the moment) adding the location to local storage
 *
 * @param {String} locationID
 * @param {Boolean} hasTerrace
 * @param {Boolean} buildingToTheWest
 * @param {float} angle
 */
export function savePub(locationID, hasTerrace, buildingToTheWest, angle) {

    addLocationToLocal(locationID);

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
