const FOURSQUARE_URL = 'https://d310g5te00bhi.cloudfront.net/v2/venues/search\?client_id\=FNJEOV4QV4YBMJ4J5EQNKQTCQXOQBCUSIIYIZAXWMKLY5XPN\&client_secret\=NEKCZ4IFX4SOJEPDY2E1ZIV4NTAYZ3GWQHWKKPSQF3KOZKCS\&v\=1396279715756\&radius\=500\&intent\=browse\&limit\=50\&categoryId\=4bf58dd8d48988d11b941735%2C4bf58dd8d48988d116941735'
const OVERPASS_URL = 'https://d3uucvr9hc3v2b.cloudfront.net/api/interpreter?data=[out:json];((way({bounds})[%22building%22]);(._;node(w);););out;'
const OVERPASS_BOUND = 0.0011;
const ROADS = false;
const FS_PRECISION = 1000;
const API = '/';
const ACCEPTED_PLACE_TYPES = ['establishment', 'art_gallery', 'bar', 'cafe', 'casino', 'liquor_store', 'movie_theater', 'night_club', 'restaurant', 'stadium', 'food', 'premise'];
const MAPBOX_API_KEY = 'pk.eyJ1IjoicmljaHBva2UiLCJhIjoiY2ozNDc2aWR3MDAxZjMycWtxcmh2MXh3ayJ9.osNPIJFwKW6lo-vQ216qwg';
const MAPBOX_GEOCODING_API = `http://api.mapbox.com/geocoding/v5/mapbox.places/{term}.json?access_token=${MAPBOX_API_KEY}`
const MAP_CONFIG = [
    {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "lightness": "7"
            },
            {
                "saturation": "54"
            },
            {
                "hue": "#ffb100"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "geometry",
        "stylers": [
            {
                "saturation": "2"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "lightness": "5"
            },
            {
                "saturation": "0"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.government",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.place_of_worship",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.school",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.sports_complex",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.sports_complex",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.sports_complex",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
];

const config = {
    FOURSQUARE_URL,
    OVERPASS_BOUND,
    ROADS,
    FS_PRECISION,
    API,
    MAP_CONFIG,
    ACCEPTED_PLACE_TYPES,
    MAPBOX_API_KEY,
    MAPBOX_GEOCODING_API
}

export default config;
