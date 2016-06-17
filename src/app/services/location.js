import config from '../config';

/**
 * Get location from the browser.
 * @returns Promise
 */
export function getLocation() {
    var p = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
            let { latitude, longitude } = position.coords;
            resolve({lat: latitude, lng: longitude});
        },
        (err) => {
            resolve({error: err});
        }
        );
    });
    return p;
}

/**
 * Reduce specificity of a lat lng, to make a request cacable by the uri for a certain region.
 * @param Object centre
 * @returns Object centre
 */
export function floorLatLng(centre) {
    const lat = Math.floor(centre.lat * config.FS_PRECISION) / config.FS_PRECISION;
    const lng = Math.floor(centre.lng * config.FS_PRECISION) / config.FS_PRECISION;
    return { lat, lng };
}
