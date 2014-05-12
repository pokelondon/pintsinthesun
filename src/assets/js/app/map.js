define([
        'jquery',
        'underscore',
        'mediator'
    ], function($, _, Mediator) {

        var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/1a1b06b230af4efdbb989ea99e9841af/997/256/{z}/{x}/{y}.png';
        var osmUrl = 'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var mapBoxUrl = 'https://a.tiles.mapbox.com/v3/errkk.hmcik8n5/{z}/{x}/{y}@2x.png'
        var tileProvider = mapBoxUrl;
        this.defaultCentre = {lat: 51.524312, lng: -0.076432};

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
            }, this));

            // Update hash via pub sub message
            this.map.on('moveend', _.bind(this.updatedCentre, this));
        };

        Map.prototype.updatedCentre = function() {
            var data = this.map.getCenter();
            this.publish('map:update_centre', {lat: data.lat, lng: data.lng});
        };

        Map.prototype.loadCentre = function() {
            // Unless geolocation is available
            this.centreCurrentLocation();
        };

        Map.prototype.setCentre = function(centre) {
            this.map.setView(centre, 18);
        };

        Map.prototype.centreCurrentLocation = function() {
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(_.bind(function(position) {
                    var centre = {};
                    centre.lat = position.coords.latitude;
                    centre.lng = position.coords.longitude;
                    this.map.setView(centre, 18);
                    this.publish('geolocation:complete', position.coords);
                }, this));
            } else {
                // That didnt work, do the default
                this.map.setView(this.defaultCentre, 18);
            }
        };

        return Map;
});

