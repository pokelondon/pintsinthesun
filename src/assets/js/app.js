/**
 * Config and app loader
 */
requirejs.config({
    'baseUrl': 'assets/js/lib',
    'paths': {
        'app': '../app',
        'slider': '../app/slider',
        'threeDBuidlings': '../app/threeDBuidlings',
        'mediator': '../app/mediator',
        'map': '../app/map',
        'OSMBuildings': 'osmbuildings/OSMBuildings-Leaflet',
        'leaflet': 'http://cdn.leafletjs.com/leaflet-0.7/leaflet',
        //'threejs': 'https://cdn.rawgithub.com/mrdoob/three.js/master/build/three',
        'trackball': 'THREE.trackballcontrolls',
        'd3': 'http://d3js.org/d3.v3.min',
        //'threeD': 'd3.threeD',
    },
    "shim": {
        'OSMBuildings': {
            exports: 'OSMBuildings',
            deps: ['leaflet']
        },
        'jquery': {
            exports: '$'
        },
        'jquery.event.move': ['jquery'],
        'underscore': {
            exports: '_'
        },
        'd3': {
            exports: ['d3']
        },
        'trackball': {
            deps: ['threejs']
        }
    }
});

// Load the main app module to start the app
requirejs(["app/main"]);
