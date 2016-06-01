//const geocoder = new google.maps.Geocoder();

export function geocode(searchTerm, callback) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: searchTerm}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            callback({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng(),
            });
        }
        //TODO - handle error
    });

}
