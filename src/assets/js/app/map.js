define([
        'jquery',
        'underscore',
        'mediator'
    ], function($, _, Mediator) {

        var cloudmadeUrl = 'https://{s}.tile.cloudmade.com/1a1b06b230af4efdbb989ea99e9841af/997/256/{z}/{x}/{y}.png';
        var osmUrl = 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var tileProvider = 'https://a.tiles.mapbox.com/v3/poke.ifimp0gk/{z}/{x}/{y}.png';
        var defaultCentre = {lat: 51.524312, lng: -0.076432};

        var Map = function() {
            _.extend(this, Mediator);

            // Init stuff
            this.map = new L.Map('map');

            // Raster base layer
            this.baseLayer = L.tileLayer(tileProvider).addTo(this.map);

            // Elements
            var $btnLocate = $('.js-locate-me');

            // Events
            $btnLocate.on('click', _.bind(function(evt) {
                evt.preventDefault();
                $btnLocate.addClass('is-loading');
                this.centreCurrentLocation();
                this.subscribe('geolocation:complete', function() {
                    $btnLocate.removeClass('is-loading');
                });
                this.publish('geolocation:requested');
            }, this));

            // Update hash via pub sub message
            this.map.on('dragend', _.bind(this.updatedCentre, this));
        };

        /**
         * Publish an event when the map centre changes,
         * Used to update the hash
         */
        Map.prototype.updatedCentre = function() {
            var data = this.map.getCenter();
            this.publish('map:update_centre', {lat: data.lat, lng: data.lng});
        };

        /**
         * Load the default centre, then try to locate the user
         * Called on by the Router when no location is specified
         */
        Map.prototype.loadCentre = function() {
            // Unless geolocation is available
            this.map.setView(defaultCentre, 18);
            this.centreCurrentLocation();
        };

        Map.prototype.setCentre = function(centre) {
            this.map.setView(centre, 18);
        };

        /**
         * Tries to centre the map on the user's location
         */
        Map.prototype.centreCurrentLocation = function() {
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(_.bind(function(position) {
                    var centre = {};
                    centre.lat = position.coords.latitude;
                    centre.lng = position.coords.longitude;
                    this.map.setView(centre, 18);
                    this.publish('geolocation:complete', position.coords);
                    this.updatedCentre();
                }, this));
            }
        };

        return Map;
});

