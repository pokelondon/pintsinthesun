//const geocoder = new google.maps.Geocoder();
const autoCompleteService = new google.maps.places.AutocompleteService();

export function geocode(searchTerm, bounds, callback) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: searchTerm, bounds: bounds}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            callback({
                status: 'OK',
                centre: {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                }
            });
        } else
        if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
            callback({status: 'ZERO_RESULTS'});
        } else {
            callback({status: 'ERROR'});
        }

    });
}

export function reverseGeocode(location, callback) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({location: location}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            //find the most appropriate address format (higher index = more prefereable)
            let addressText;
            const addressFormatPreference = ['postal_code', 'train_station', 'street_address'];
            addressFormatPreference.forEach( (addressFormat) => {
                results.forEach( (address) => {
                    if(address.types.indexOf(addressFormat) != -1) {
                        addressText = address.formatted_address;
                    }
                });
            });
            callback({
                status: 'OK',
                address: addressText
            });
        } else
        if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
            callback({status: 'ZERO_RESULTS'});
        } else {
            callback({status: 'ERROR'});
        }

    });
}


export function searchPubs(searchTerm, bounds, callback) {
    if(!searchTerm){
        return;
    }

    autoCompleteService.getPlacePredictions({input: searchTerm, bounds: bounds}, (predictions, status) => {
        if(status === google.maps.places.PlacesServiceStatus.OK) {
            callback(predictions);
        }
    });
}


export function getLocationData(placeID, map, callback) {
    const placesService = new google.maps.places.PlacesService(document.createElement('div'));
    placesService.getDetails({placeId: placeID}, (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            callback(result);
        }
    });
}
