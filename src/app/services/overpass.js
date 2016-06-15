// import promise from 'es6-promise';
// import 'isomorphic-fetch';
// promise.polyfill();

/**
 * Prepare paths from overpass feature data.
 * Features have a bunch of references to nodes.
 * Nodes for a certain feature are filtered and sorted.
 * @param feature Object
 * @param nodes Array
 * @returns Array
 */
function filterNodes(feature, nodes) {
    var path = nodes.filter(function(node) {
        // Find nodes that are part of this feature
        return 0 <= feature.nodes.indexOf(node.id);
    }).sort(function(a, b) {
        // Order nodes in the order that they are specified in the feature
        return feature.nodes.indexOf(a.id) - feature.nodes.indexOf(b.id);
    }).map(function(node) {
        // Convert node objects to lat/lng array for passing to polygon function
        return [node.lon, node.lat];
    });

    return path;
}

const makeCancelable = (promise) => {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then((val) => hasCanceled_ ? reject({isCanceled: true}) : resolve(val));
        promise.catch((error) => hasCanceled_ ? reject({isCanceled: true}) : reject(error));
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
};

/**
 * Get buildings around a certain lat/lng.
 * Finds features that are pubs and gets sorted outline paths for them
 * @param lat number
 * @param lng number
 * @returns Promise
 */
export function fetchBuildings(lat, lng) {
    var bound = 0.0008;
    var box = [lat - bound, lng - bound,
               lat + bound, lng + bound];
    let bounds = box.join(',');

    return makeCancelable(fetch(`http://overpasscache.pintsinthesun.co.uk/api/interpreter?data=[out:json];((way(${bounds})[%22building%22]);(._;node(w);););out;`)
        .then(data => data.json())
        .then(data => {
            let nodes = data.elements.filter(item => 'node' === item.type);
            let features = data.elements.filter(item => 'way' === item.type && item.tags.building);

            var buildings = features.map(feature => {
                var levels = feature.tags['building:levels'] || 2;
                var isPub = ('pub' === feature.tags.amenity);
                var outlinePath = filterNodes(feature, nodes);
                return {outlinePath, levels, isPub};
            });

            return buildings;
        }));
}
