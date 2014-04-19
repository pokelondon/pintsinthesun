define([
        'jquery',
        'underscore',
        'mediator'
    ], function($, _, Mediator) {

        var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/1a1b06b230af4efdbb989ea99e9841af/997/256/{z}/{x}/{y}.png';
        var osmUrl = 'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var mapBoxUrl = 'https://a.tiles.mapbox.com/v3/errkk.hmcik8n5/{z}/{x}/{y}@2x.png'
        var tileProvider = mapBoxUrl;
        var defaultCentre = {lat: 51.524312, lng: -0.076432};

        var Map = function() {
            _.extend(this, Mediator);

            // Init stuff
            this.map = new L.Map('map');
            this.loadCentre();

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

            this.map.on('moveend', _.bind(function() {
                this.publish('map:moveend');
            }, this));

            // Object subscribers
            this.subscribe('map:moveend', this.saveCentre);

        };

        Map.prototype.saveCentre = function() {
            var data = this.map.getCenter();
            var centre = JSON.stringify({lat: data.lat, lng: data.lng});
            window.localStorage.setItem('centre', centre);
            window.localStorage.setItem('zoom', this.map.getZoom());
        };

        Map.prototype.loadCentre = function() {
            var centre = defaultCentre;
            var data = window.localStorage.getItem('centre');
            var cachedCentre = JSON.parse(data);
            var zoom = window.localStorage['zoom'] || 18;
            try {
                // Try to load saved centre
                this.map.setView(cachedCentre, zoom);
            } catch(e) {
                // That didnt work, do the default
                this.map.setView(centre, zoom);
                // Unless geolocation is available
                this.centreCurrentLocation();
            }
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
            }
        };

        return Map;
});

