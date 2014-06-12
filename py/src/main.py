#! /bin/python

from __future__ import division

import json

from flask import Flask, request, make_response
import requests

from heightfinder import HeightFinder

app = Flask(__name__)

OVERPASS_URL = 'http://overpasscache.pintsinthesun.co.uk/api/interpreter?data=[out:json];((way({bounds})[%22building%22]);(._;node(w);););out;'
OVERPASS_BOUND = 0.0011

@app.route('/')
def hello_world():
    return 'Hello World!'
"""
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
                window.data = [];

                /**
                 * Add a feature from the GeoJSON to the 3D scene
                 */
                function renderFeature(feature) {
                    var levels = feature.tags['building:levels'] || 2;
                    var isPub = (feature.tags.amenity == 'pub');
                    var outlinePath = filterNodes(feature, nodes);
                    // Render the buidling in 3D
                    self.scene.renderBuilding(outlinePath, levels, isPub);

                    window.data.push({path: outlinePath, centre: centre });
                }
"""

@app.route('/heightmap/<lat>/<lng>/', methods=['GET', ])
def get_heights(lat, lng):

    lat, lng = float(lat), float (lng)

    box = [lat - OVERPASS_BOUND,
           lng - OVERPASS_BOUND,
           lat + OVERPASS_BOUND,
           lng + OVERPASS_BOUND];

    url = OVERPASS_URL.format(bounds=','.join(map(str, box)))

    res = requests.get(url)
    data = res.json()

    nodes = filter(lambda item: 'node' == item['type'], data['elements'])
    features = filter(lambda item: 'way' == item['type'] and item['tags']['building'], data['elements'])

    buildings = []
    hf = HeightFinder((lat, lng))
    for f in features:
        nodes_in_feature = filter(lambda item: item['id'] in f['nodes'], nodes)
        nodes_in_feature.sort(key=lambda node: f['nodes'].index(node['id']))
        # Might need to sort by index order in nodes list
        p = [(n['lon'], n['lat']) for n in nodes_in_feature]
        is_pub = f['tags'].get('amenity', None) == 'pub'
        levels = f['tags'].get('building:levels', 2)
        building = {'outline': p, 'is_pub': is_pub, 'levels': levels}

        mean, median, mode = hf.sample_heightmap_wgs84(p)
        building['height'] = {'median': median, 'mean': mean}

        buildings.append(building)

    resp = make_response(json.dumps(buildings), 200)
    resp.headers['content-type'] = 'text/json'
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/tiles/', methods=['GET', ])
def available_tiles():
    pass

if '__main__' == __name__:
    app.run(debug=True)
