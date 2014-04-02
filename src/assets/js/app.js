/**
 * Config and app loader
 */
requirejs.config({
    "baseUrl": "assets/js/lib",
    "paths": {
      "app": "../app"
    },
    "shim": {
        "$": ["jquery"],
        "_": ["underscore"]
    }
});

// Load the main app module to start the app
requirejs(["app/main"]);
