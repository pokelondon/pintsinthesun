import config from '../config';
import haversine from 'haversine';
import _ from 'lodash';

/**
* Check if the list of types is classed as a pub
* This is now deliberately vague and accepts 'establishment' as a pub, because the
* types returned from google autocomplete is not as detailed as a full place lookup
* @param {Array} typeArray - the array of types returned by google
* @return {boolean} Whether we deem it a pub or not
*/
export const testIsPub = (typeArray) => {
    return typeArray.some((type) => {
        return config.ACCEPTED_PLACE_TYPES.indexOf(type) >= 0;
    });
}


/**
* Return a suggested pub from a list.
* Filters list for only 'known' pubs, then orders by distance and returns the
* closest
* @param {object} pubsList - object of pubs, keyed by ID
* @param {object} centre - the current location in the format {lat, lng}
* @return {object} the suggest pub
*/
export const getSuggestedPub = (pubs, centre) => {
    const pubsArray = _.values(pubs);
    const sortedPubs = pubsArray.filter((pub) => {
        return pub.known;
    }).sort((a, b) => {
        const centreFormatted = {latitude: centre.lat, longitude: centre.lng};
        const pointA = {latitude: a.location.coordinates[1], longitude: a.location.coordinates[0]};
        const pointB = {latitude: b.location.coordinates[1], longitude: b.location.coordinates[0]};
        const distanceA = haversine(centreFormatted, pointA);
        const distanceB = haversine(centreFormatted, pointB);
        return distanceA > distanceB ? 1 : -1;
    });
    return _.find(sortedPubs, pub => pub.known);
}

/**
* Convert Mongo style lat/lng format (backwards array) to a more useful {lat, lng} format
* @param {array} arr - the mongo style location array
* @return {object} - the position in the form {lat, lng}
*/
export const normaliseLatLng = (arr) => {
    return {lat: arr[1], lng: arr[0]};
}