define([ ],
    function($, _, leaflet, Backbone, Slider, moment, ThreeDScene, Mediator, Map, Form) {
    return {
        OVERPASS_URL: 'http://overpasscache.pintsinthesun.co.uk/api/interpreter?data=[out:json];((way({bounds})[%22building%22]);(._;node(w);););out;',
        OVERPASS_BOUND: 0.0011
    }
});
