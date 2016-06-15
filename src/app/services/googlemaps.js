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
