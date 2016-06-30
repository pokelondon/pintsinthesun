//const geocoder = new google.maps.Geocoder();

export function geocode(searchTerm, callback) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: searchTerm}, (results, status) => {
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
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({location: location}, (results, status) => {
        console.log('service', results);
        if (status === google.maps.GeocoderStatus.OK) {

            //find the most appropriate address format
            let addressText;
            //const addressFormatPreference = ['street_address', 'postal_code', 'train_station', 'point_of_interest'];
            const addressFormatPreference = ['street_address'];
            results.forEach( (address) => {
                addressFormatPreference.forEach( (addressFormat) => {
                    if(address.types.indexOf(addressFormat) != -1) {
                        addressText = address.formatted_address;
                    }
                });
            })

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
