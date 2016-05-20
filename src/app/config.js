const FOURSQUARE_URL = 'https://d310g5te00bhi.cloudfront.net/v2/venues/search\?client_id\=FNJEOV4QV4YBMJ4J5EQNKQTCQXOQBCUSIIYIZAXWMKLY5XPN\&client_secret\=NEKCZ4IFX4SOJEPDY2E1ZIV4NTAYZ3GWQHWKKPSQF3KOZKCS\&v\=1396279715756\&radius\=500\&intent\=browse\&limit\=50\&categoryId\=4bf58dd8d48988d11b941735%2C4bf58dd8d48988d116941735'
const OVERPASS_URL = 'http://overpasscache.pintsinthesun.co.uk/api/interpreter?data=[out:json];((way({bounds})[%22building%22]);(._;node(w);););out;'
const OVERPASS_BOUND = 0.0011;
const ROADS = false;
const FS_PRECISION = 1000;

const config = {
    FOURSQUARE_URL,
    OVERPASS_URL,
    OVERPASS_BOUND,
    ROADS,
    FS_PRECISION,
}

export default config;
