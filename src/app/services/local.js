
/**
 * Add a location to local storage
 *
 * @param {String} locationID
 */
export function addLocation(locationID) {
    let locations = JSON.parse(localStorage.getItem('locations'));
    locations = locations || [];
    
    if(!existsInLocalStorage(locationID)) {
        locations.push(locationID);
        localStorage.setItem('locations', JSON.stringify(locations));
    }

}


/**
 * Check if a location exists in local storage
 *
 * @param {String} tag
 * @returns {Boolean}
 */
export function existsInLocalStorage(locationID) {
    let locations = JSON.parse(localStorage.getItem('locations'));
    if(!locations) return false;
    return locations.indexOf(locationID) === -1 ? false : true;
}
