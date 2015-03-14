/**
 * Config and app loader
 */
requirejs.config({
    'baseUrl': 'assets/js/app',
    'paths': {
        'mediator': '../lib/mediator',
        'backbone': '../lib/backbone',
        'underscore': '../lib/underscore',
        'jquery': '../lib/jquery',
        'd3': '../lib/d3',
        'jquery.event.move': '../lib/jquery.event.move',
        'moment': '../lib/moment',
    },
    'shim': {
        'jquery': {
            exports: '$'
        },
        'jquery.event.move': ['jquery'],
        'underscore': {
            exports: '_'
        },
        'd3': {
            exports: ['d3']
        }
    }
});

// Load the main app module to start the app
requirejs(["main"]);
