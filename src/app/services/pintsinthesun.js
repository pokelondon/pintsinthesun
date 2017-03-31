import config from '../config';
import {addLocation as addLocationToLocal} from './local';

export function savePub(placeID, pubDetails) {

    const payload = {
        outdoor_angle: pubDetails.outdoorAngle,
        has_outside_space: pubDetails.hasOutsideSpace,
        has_garden: pubDetails.hasGarden
    };

    const data = JSON.stringify(payload);

    return fetch(`${config.API}pub/${placeID}`, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    });

}


export function getPub(placeID) {
    return fetch(`${config.API}pub/${placeID}`, {
        method: 'get',
        headers: {
            "Content-Type": "application/json"
        }
    });
}

/**
 * Returns list of locations that are in the database
 *
 * @param {Array} ids - array of place IDs we want to check
 */
// export function checkPubsExist(ids) {
//
//     const data = JSON.stringify(ids);
//
//     return fetch(`${config.API}pub/exists/`, {
//         method: 'post',
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: data
//     }).then(
//         data => data.json()
//     );
//
// }
