define([
        'jquery',
        'underscore',
        'OSMBuildings',
        'slider',
        'moment',
        'threeDBuidlings',
        'mediator',
        'map'
    ], function($, _, OSMBuildings, Slider, moment, ThreeDScene, Mediator, Map) {

        var FOURSQUARE_URL = 'https://api.foursquare.com/v2/venues/search\?client_id\=FNJEOV4QV4YBMJ4J5EQNKQTCQXOQBCUSIIYIZAXWMKLY5XPN\&client_secret\=NEKCZ4IFX4SOJEPDY2E1ZIV4NTAYZ3GWQHWKKPSQF3KOZKCS\&v\=1396279715756\&ll\={lat}%2C{lng}\&radius\=500\&intent\=browse\&limit\=50\&categoryId\=4bf58dd8d48988d11b941735%2C4bf58dd8d48988d116941735'
        var OVERPASS_URL = 'http://overpass-api.de/api/interpreter?data=[out:json];((way({bounds})[%22building%22]);(._;node(w);););out;'

        var pintIcon = L.icon({
            iconUrl: 'assets/img/pint-icon.png',
            iconRetinaUrl: 'assets/img/pint-icon@2x.png',
            iconSize: [30, 54],
            iconAnchor: [15, 54],
            popupAnchor: [0, -60],
            shadowUrl: 'assets/img/pint-icon-shadow.png',
            shadowRetinaUrl: 'assets/img/pint-icon-shadow@2x.png',
            shadowSize: [49, 27],
            shadowAnchor: [10, 27]
        });

        /**
         * Utility to parse strings with placeholders
         */
        function format(str, values) {
           _(values).each(function(v, k) {
                str = str.replace('{' + k + '}', v);
            });
           return str;
        }

        /**
         * Main app
         * Instanciates other components and controlls the display and flow of the page
         */
        var App = function(mapController) {
            _.extend(this, Mediator);
            this.mapController = mapController;

            // Elements
            this.$btnLoadPubs = $('.js-load-pubs');
            this.$time = $('.js-slider-time');
            this.$clock = $('.js-clock');

            // Events
            this.$btnLoadPubs.on('click', _.bind(this.loadPubsButton, this));

            // Mediator events
            this.subscribe('foursquare:loaded', this.plotPubs);
            this.subscribe('clock:change', function(m) {
                this.$clock.text(m.format("H:mm a"));
            });

            // Init stuff
            this.setUpTime();

        };

        /**
         * Load pubs form FSQ near to the map centre.
         * Publishes an event to the mediator when complete
         */
        App.prototype.getPubs = function () {
            var centre = this.mapController.map.getCenter();
            var url = format(FOURSQUARE_URL, {lat: centre.lat, lng: centre.lng});
            $.getJSON(url, _.bind(function(data) {
                this.publish('foursquare:loaded', data);
            }, this));
        };

        /**
         * Triggers ajax load of locations
         */
        App.prototype.loadPubsButton = function(evt) {
            evt.preventDefault();
            this.$btnLoadPubs.addClass('is-loading');
            this.getPubs();
        };

        /**
         * Plots pubs on the map.
         * Subscribe to the ajax event to recieve data when its ready
         */
        App.prototype.plotPubs = function(data) {
            var self = this;
            this.$btnLoadPubs.removeClass('is-loading');
            _(data.response.venues).each(function(item) {
                var m = L.marker([item.location.lat, item.location.lng], {icon: pintIcon})
                        .addTo(self.mapController.map)
                        .bindPopup(item.name);
                m.on('click', function() {
                    m.openPopup();
                });
            });
        };

        /**
         * Set up the app's simulated time. Publishes events when it changes so all
         * suscribers can update their shit
         */
        App.prototype.setUpTime = function() {
            this.m = moment();
            this.m.hour(8).minute(0).second(0);
            var duration = moment.duration(12, 'hours').asSeconds();

            var slider = new Slider(this.$time, _.bind(function(data) {
                var newM = this.m.clone().add(duration * data / 100, 'seconds');
                this.publish('clock:change', newM);
            }, this));

            // TODO set slider to now
        };

        App.prototype.renderLocality = function(centre) {
            var scene = new ThreeDScene();
            var centre = centre || this.mapController.map.getCenter();
            scene.setCentre([centre.lng, centre.lat]);
            var bound = 0.0008;
            var box = [centre.lat - bound, centre.lng - bound, centre.lat + bound, centre.lng + bound];
            var url = format(OVERPASS_URL, {bounds: box.join(',')});

            $.getJSON(url, function(data) {
                // Filter items from the GeoJSON into nodes and features
                var nodes = _(data.elements).filter(function(item) { return 'node' == item.type; });
                var features = _(data.elements).filter(function(item) { return 'way' == item.type && item.tags.building; });

                /**
                 * Add a feature from the GeoJSON to the 3D scene
                 */
                function renderFeature(feature) {
                    var levels = feature.tags['building:levels'] || 3;
                    var isPub = (feature.tags.amenity == 'pub');
                    var outlinePath = _(nodes).chain().filter(function(node) {
                        // Find nodes that are part of this feature
                        return 0 <= feature.nodes.indexOf(node.id);
                    }).sortBy(function(node) {
                        // Order nodes in the order that they are specified in the feature
                        return feature.nodes.indexOf(node.id);
                    }).map(function(node) {
                        // Convert node objects to lat/lng array for passing to polygon function
                        return [node.lon, node.lat];
                    }).value();

                    // Close path
                    outlinePath.push(outlinePath[0]);
                    // Render the buidling in 3D
                    scene.renderBuilding(outlinePath, levels, isPub);
                }

                _(features).each(renderFeature);
            });
        };


        $(document).ready(function() {
            var mapController = new Map();
            var app = new App(mapController);

            // Bind button
            var $btnOverlay = $('.js-open-modal');
            $btnOverlay.on('click', function(evt) {
                evt.preventDefault();
                $('.js-modal').toggleClass('is-open');
                app.renderLocality();
            });


            var $btnCloseOverlay = $('.js-close-modal');
            $btnCloseOverlay.on('click', function(evt) {
                evt.preventDefault();
                $('.js-modal').removeClass('is-open');
            });
        });

});
