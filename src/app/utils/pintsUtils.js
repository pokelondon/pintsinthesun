import config from '../config';

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