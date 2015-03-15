define([
        'jquery',
        'underscore',
        'backbone',
        'd3',
        'config'
        ],
        function($, _, Backbone, d3, config) {

            /**
             * Return notes, in order that belong to a certain feature
             */
            function _filterNodes(feature, nodes) {
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

            /**
            * Utility to parse strings with placeholders
            */
            function _format(str, values) {
                _(values).each(function(v, k) {
                    str = str.replace('{' + k + '}', v);
                    str = str.replace('{' + k + '}', v);
                });
                return str;
            }
            function _convertProjection(coords, centre, centreCanvas) {
                // Centre needs to be array, and backwards: [lng, lat]
                var centreCoords = [centre.lng, centre.lat];
                var tileSize = 128; // Pixel size of a single map tile
                var zoom = config.ZOOM || 17; // Zoom level
                var projection = d3.geo.mercator()
                    .center(centreCoords) // Geographic coordinates of map centre
                    .translate(centreCanvas) // Pixel coordinates of .center()
                    .scale(tileSize << zoom); // Scaling value
                var pixelValue = projection(coords); // Returns [x, y]
                return [pixelValue[1] * -1, pixelValue[0] * -1];
            }

            /**
             * Generator to create a mappable projection convert function
             * that has closure access to centre, and canvasCentre
             */
            function _convertProjectionGenerator(centre, canvasDimentions) {
                var centreCanvas = [-1 * canvasDimentions[0] / 2, -1 * canvasDimentions[1] / 2];
                return function(coords) {
                    return _convertProjection(coords, centre, centreCanvas);
                };
            }

            function getOutlines(centre, canvasDimentions, buildingFn, roadFn) {

                var bound = config.OVERPASS_BOUND || 0.0008;
                var box = [centre.lat - bound, centre.lng - bound, centre.lat + bound, centre.lng + bound];
                var url = _format(config.OVERPASS_URL, {bounds: box.join(',')});
                // Make a mappable converter
                var convertProjection = _convertProjectionGenerator(centre, canvasDimentions);

                $.getJSON(url, function(data) {
                    // Filter items from the GeoJSON into nodes and features
                    var nodes = _(data.elements).filter(function(item) { return 'node' == item.type; });
                    var features = _(data.elements).filter(function(item) { return 'way' == item.type && item.tags.building; });
                    var roads = _(data.elements).filter(function(item) { return 'way' == item.type && item.tags.highway; });

                    /**
                     * Add a feature from the GeoJSON to the canvas
                     */
                    function callbackBuilding(feature) {
                        var levels = feature.tags['building:levels'] || 2;
                        var isPub = (feature.tags.amenity == 'pub');
                        var outlinePath = _filterNodes(feature, nodes);
                        var points = _(outlinePath).map(convertProjection);
                        buildingFn(points, levels, isPub);
                    }

                    function callbackRoad(feature) {
                        var outlinePath = _filterNodes(feature, nodes);
                        var points = _(outlinePath).map(convertProjection);
                        roadFn(points);
                    }

                    _(features).each(callbackBuilding);
                    _(roads).each(callbackRoad);
                });
            }

            return {
                getOutlines: getOutlines
            }

        });

