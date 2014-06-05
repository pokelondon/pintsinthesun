define([
        'jquery',
        'underscore',
        'leaflet',
        'backbone',
        'slider',
        'moment',
        'threeDBuidlings',
        'mediator',
        'map',
        'form'
    ], function($, _, leaflet, Backbone, Slider, moment, ThreeDScene, Mediator, Map, Form) {

        var FOURSQUARE_URL = 'https://api.foursquare.com/v2/venues/search\?client_id\=FNJEOV4QV4YBMJ4J5EQNKQTCQXOQBCUSIIYIZAXWMKLY5XPN\&client_secret\=NEKCZ4IFX4SOJEPDY2E1ZIV4NTAYZ3GWQHWKKPSQF3KOZKCS\&v\=1396279715756\&ll\={lat}%2C{lng}\&radius\=500\&intent\=browse\&limit\=50\&categoryId\=4bf58dd8d48988d11b941735%2C4bf58dd8d48988d116941735'
        var OVERPASS_URL = 'http://overpass-api.de/api/interpreter?data=[out:json];((way({bounds})[%22building%22]);(._;node(w);););out;'
        var OVERPASS_BOUND = 0.0011;
        var ROADS = false;

        if(ROADS) {
            // Extra query part to fetch roads data
            OVERPASS_URL = 'http://overpass-api.de/api/interpreter?data=[out:json];((way({bounds})[%22building%22]);(._;node(w);way({bounds})[%22highway%22]);(._;node(w);););out;';
        }

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
            var self = this;
            this.mapController = mapController;
            this.pubs = {};

            // Elements
            this.$btnLoadPubs = $('.js-load-pubs');
            this.$time = $('.js-slider-time');
            this.$clock = $('.js-clock');

            // Events
            this.$btnLoadPubs.on('click', _.bind(this.loadPubsButton, this));

            // Mediator events
            this.subscribe('foursquare:loaded', this.plotPubs);
            this.subscribe('clock:change', function(m) {
                this.$clock.text(m.format("H:mm"));
            });

            // Init stuff
            this.setUpTime();

            var Router = Backbone.Router.extend({
                routes: {
                    "": 'findCentre',
                    ":lat/:lng": 'centre',
                    ":lat/:lng/:id": 'activateMarker',
                },
                centre: function(lat, lng) {
                    self.mapController.setCentre({lat: lat, lng: lng});
                    self.publish('centre:fromhash');
                    self.getPubs();
                },
                findCentre: function() {
                    self.mapController.loadCentre();
                },
                activateMarker: function(lat, lng, id) {
                    // Centre map around area so pubs can be loaded if not already there
                    // EG from a new page request
                    self.mapController.setCentre({lat: lat, lng: lng});

                    // Centre around location from hash, should match
                    // that of the foursquare location
                    self.renderLocality();

                    // If the pub isn't loaded, re query pubs in the area
                    // Then when loaded, open the popup
                    var pub = self.pubs[id];
                    if(!pub) {
                        self.getPubs();
                        self.subscribe('foursquare:loaded', _.once(function() {
                            pub = self.pubs[id];
                            pub.marker.openPopup();
                        }));
                    } else if(pub) {
                        // Of the marker can be found
                        pub.marker.openPopup();
                    } else {
                        alert('Can\'t find that pub');

                        ga('send', 'exception', {
                            'exDescription': 'Can\'t Find pub',
                            'exFatal': false
                        });
                    }
                }
            })
            this.router = new Router();
            Backbone.history.start({pushState: false});

            // Update current location hash
            // update_centre proxies to drag end (user initiated reposition)
            this.subscribe('map:update_centre', function(centre) {
                self.router.navigate(centre.lat + '/' + centre.lng, {trigger: false, replace:true});
            });
            // Load pubs for new area
            this.subscribe('map:update_centre', _.debounce(this.getPubs, 1000, true));

            // Use Router to trigger pub selection (from markers or search)
            this.subscribe('map:select_pub', function(centre, id) {
                self.router.navigate(centre.lat + '/' + centre.lng + '/' + id, {trigger: true, replace:true});
            });

            if('function' === typeof ga) {
                this.setUpEvents();
            }
        };

        App.prototype.setUpEvents = function () {
            this.subscribe('centre:fromhash', function(centre) {
                ga('send', 'pageview', '/location-from-hash');
            });

            this.subscribe('map:centre', function(centre) {
                ga('send', 'event', 'map', 'center');
            });

            this.subscribe('map:select_pub', function(centre, id) {
                ga('send', 'event', 'map', 'marker', id);
            });

            this.subscribe('track:click:render', function(name) {
                ga('send', 'event', 'button', 'click', 'render');
            });

            this.subscribe('geolocation:requested', function() {
                ga('send', 'event', 'button', 'click', 'locate');
            });

            this.subscribe('foursquare:loaded', function() {
                ga('send', 'event', 'button', 'click', 'find pubs');
            });

            this.subscribe('form:submit', function() {
                ga('send', 'event', 'button', 'click', 'search');
            });
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
            }, this)).error(function(error) {
                ga('send', 'exception', {
                    'exDescription': 'Can\'t get pubs from Foursquare',
                    'exFatal': false
                });
            });
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
                if(self.pubs[item.id]) {
                    return;
                }
                var m = L.marker([item.location.lat, item.location.lng], {icon: pintIcon})
                        .addTo(self.mapController.map)
                        .bindPopup(item.name);

                m.on('click', function() {
                    // Change hash so Router can handle displaying it
                    self.publish('map:select_pub', item.location, item.id);
                });

                // Save reference to marker as well
                item.marker = m;
                self.pubs[item.id] = item;
            });
        };

        /**
         * Set up the app's simulated time. Publishes events when it changes so all
         * suscribers can update their shit
         */
        App.prototype.setUpTime = function() {
            var startHour = 8;
            this.m = moment();
            this.m.hour(startHour).minute(0).second(0);
            var duration = moment.duration(12, 'hours').asSeconds();

            var slider = new Slider(this.$time, _.bind(function(data) {
                var newM = this.m.clone().add(duration * data / 100, 'seconds');
                this.publish('clock:change', newM);
                this.publish('slider:change', data);
            }, this));

            var hournow = new Date().getHours();
            var fromStart = hournow - startHour;
            this.currentPercent = fromStart / 12 * 100;

            this.subscribe('clock:change', function(m) {
                // save the current moment that the slider's at for when
                // the 3d view first inits
                window.currentMoment = m;
            });

            slider.set(this.currentPercent);
        };

        App.prototype.renderLocality = function(centre) {
            var self = this;
            if(this.scene) {
                this.scene.unload();
            }

            this.scene = new ThreeDScene();
            var centre = centre || this.mapController.map.getCenter();
            this.publish('map:centre', centre);
            this.scene.setCentre([centre.lng, centre.lat]);
            var bound = OVERPASS_BOUND || 0.0008;
            var box = [centre.lat - bound, centre.lng - bound, centre.lat + bound, centre.lng + bound];
            var url = format(OVERPASS_URL, {bounds: box.join(',')});

            /**
             * Return notes, in order that belong to a certain feature
             */
            function filterNodes(feature, nodes) {
                var path = _(nodes).chain().filter(function(node) {
                    // Find nodes that are part of this feature
                    return 0 <= feature.nodes.indexOf(node.id);
                }).sortBy(function(node) {
                    // Order nodes in the order that they are specified in the feature
                    return feature.nodes.indexOf(node.id);
                }).map(function(node) {
                    // Convert node objects to lat/lng array for passing to polygon function
                    return [node.lon, node.lat];
                }).value();

                return path;
            }

            $.getJSON(url, function(data) {
                // Filter items from the GeoJSON into nodes and features
                var nodes = _(data.elements).filter(function(item) { return 'node' == item.type; });
                var features = _(data.elements).filter(function(item) { return 'way' == item.type && item.tags.building; });

                /**
                 * Add a feature from the GeoJSON to the 3D scene
                 */
                function renderFeature(feature) {
                    var levels = feature.tags['building:levels'] || 2;
                    var isPub = (feature.tags.amenity == 'pub');
                    var outlinePath = filterNodes(feature, nodes);
                    // Render the buidling in 3D
                    self.scene.renderBuilding(outlinePath, levels, isPub);
                }

                function renderRoad(feature) {
                    var path = filterNodes(feature, nodes);
                    self.scene.renderRoad(path);
                }

                _(features).each(renderFeature);

                if (ROADS) {
                    var roads = _(data.elements).filter(function(item) { return 'way' == item.type && item.tags.highway; });
                    _(roads).each(renderRoad);
                }
            });
        };


        $(document).ready(function() {

            if (!window.WebGLRenderingContext || navigator.appVersion.match(/iPhone/)) {
                $('.js-render-canvas').parent().addClass('has-error');

            }
            if(navigator.appVersion.match(/iPhone/)) {
                $('.u-iphone-only').removeClass('u-iphone-only');
            }
            var mapController = new Map();
            var app = new App(mapController);
            var form = new Form(mapController);

            // Warp the pint logo so it follows the shadow
            (function() {
                var $pint = $('.Pint-shad');
                var h = $pint.height();
                app.subscribe('slider:change', function(perc) {
                    perc = (perc / 100);
                    var element = $pint[0];
                    var angle = Math.floor((90 * perc) - 45);
                    var transform  = 'skewX(' + angle + 'deg) translateY(-64px)';
                    element.style.webkitTransform = transform;
                    element.style.MozTransform = transform;
                    element.style.msTransform = transform;
                    element.style.OTransform = transform;
                    element.style.transform = transform;
                });
                app.publish('slider:change', app.currentPercent);
            }());

            function closeModal() {
                $('.js-modal').removeClass('is-open');
                $('body').removeClass('modal-open');
            }

            function openModal() {
                $('.js-modal').addClass('is-open');
                $('body').addClass('modal-open');
            }

            // Update modal title depending on the pub
            app.subscribe('map:centre', closeModal);

            var $btnRender = $('.js-render-locality');
            $btnRender.on('click', function(evt) {
                app.publish('track:click:render');
                evt.preventDefault();
                app.renderLocality();
            });

            // Modal Close button
            var $btnCloseOverlay = $('.js-close-modal');
            $btnCloseOverlay.on('click', function(evt) {
                evt.preventDefault();
                closeModal();
            });
            $('.js-open-modal').on('click', function(evt) {
                evt.preventDefault();
                openModal();
            });
            $('.Modal-container').on('click', function(evt) {
                closeModal();
            });
            $('.Modal-body').on('click', function(evt) {
                evt.stopPropagation();
            });
            $(window).on('keyup', function(evt) {
                var ESC = 27;
                if(ESC === evt.keyCode) {
                    closeModal();
                }
            });

            var $about = $('.js-about').hide();
            var $btnAbout = $('.js-open-about');
            $btnAbout.on('click', function(evt) {
                evt.preventDefault();
                $about.slideToggle();
                $btnAbout.toggleClass('is-activated');
            });
        });
});
