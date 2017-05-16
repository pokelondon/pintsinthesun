import config from '../config';
import {addLocation as addLocationToLocal} from './local';

export function savePub(placeID, pubDetails) {

    const payload = {
        outdoor_angle: pubDetails.outdoorAngle || 0,
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


export function getUnapprovedPubs() {
    return fetch(`${config.API}pubs/?approved=false&rejected=false`, {
        method: 'get',
        headers: {
            "Content-Type": "application/json"
        }
    });
}


export function approvePub(id) {
    const payload = {
        approved: true,
        rejected: false
    };

    const data = JSON.stringify(payload);

    return fetch(`${config.API}pub/${id}`, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    });
}


export function updatePub(id, values) {

    const data = JSON.stringify(values);

    return fetch(`${config.API}pub/${id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    });
}


/**
 * Returns array placeIDs that exist already in the DB
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

