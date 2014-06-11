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
        'form': '../app/form',
        'trackball': 'THREE.trackballcontrolls'
    },
    "shim": {
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
