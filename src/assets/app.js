var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/1a1b06b230af4efdbb989ea99e9841af/997/256/{z}/{x}/{y}.png';
var osmUrl = 'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
var cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';

var geojsonURL = 'http://tile.openstreetmap.us/vectiles-highroad/{z}/{x}/{y}.json';
var style = {
        "color": "#bbb",
        "weight": 2.0,
        "opacity": 0.3
    };
var style1 = {
        "color": "#f00",
        "weight": 8.0,
        "opacity": 0.5
    };
var style2 = {
        "color": "#0fD",
        "weight": 8.0,
        "opacity": 0.5
    };

if (typeof Number.prototype.toRad == 'undefined') {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}
if (typeof Number.prototype.toDeg == 'undefined') {
    Number.prototype.toDeg = function() {
        return this * 180 / Math.PI;
    }
}

function bearing(lat1, lon1, lat2, lon2) {
    var dLon = deg2rad(lon2 - lon1);
    lat1 = lat1.toRad();
    lat2 = lat2.toRad();
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return Math.atan2(y, x).toDeg();
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function distLatLon(lat1, lon1, lat2, lon2) {
    var R = 6371000;
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}


document.addEventListener('DOMContentLoaded', function() {
    var map = new L.Map('map')

    function centreMap() {
        var centre = {lat: 51.524312, lng: -0.076432};
        var data = window.localStorage.getItem('centre');
        var cachedCentre = JSON.parse(data);
        var zoom = window.localStorage['zoom'] || 18;

        try {
            map.setView(cachedCentre, zoom);
        } catch(e) {
            map.setView(centre, zoom);
        }
    }
    centreMap();

    function setupBuildings() {
        var osmb = new OSMBuildings(map).loadData();
        var d = new Date(2014, 3, 1, 11, 0);
        var $timeEl = $('#time');
        var $hourEl = $('#hour');
        $timeEl.on('change', function() {
            var hour = $timeEl.val();
            var d = new Date(2014, 3, 1, hour, 0);
            $hourEl.text(hour);
            osmb.setDate(d);
        });

        osmb.setDate(d);
        osmb.setStyle({'roofColor': '#aaaaaa', 'wallColor': '#aaaaaa'});
    }
    setupBuildings();

    // Raster base layer
    //var baseLayer = L.tileLayer(cloudmadeUrl, {attribution: cloudmadeAttribution}).addTo(map);
    var rp = [];
    window.rp = rp;
    var geojsonTileLayer = new L.TileLayer.GeoJSON(geojsonURL, {
            clipTiles: true,
            unique: function (feature) {
                return feature.id;
            }
        }, {
            style: style,
            filter: function(feature, layer) {
                // Roads only
                return feature.properties.highway != null;
            },
            onEachFeature: function (feature, layer) {
                if (layer instanceof L.Point) {
                    return;
                }
                if (!feature.properties) {
                    return;
                }
                var c;
                var gc = false;

                if('LineString' === feature.geometry.type) {
                    c = feature.geometry.coordinates;
                } else if ('GeometryCollection' === feature.geometry.type){
                    c = feature.geometry.geometries[0].coordinates;
                } else {
                    return;
                }
                for (var i = 1; i < c.length; i++) {
                    var ll0 = c[i - 1];
                    var ll1 = c[i];
                    if (true) {
                        var part = {};
                        part.d = distLatLon(ll0[1], ll0[0], ll1[1], ll1[0]);
                        part.b = bearing(ll0[1], ll0[0], ll1[1], ll1[0]);
                        rp.push(part);
                    }
                }
                var b = bearing(c[0][0], c[0][1], c[c.length-1][0], c[c.length-1][1]);
                var angleLimit = 20;
                if(b > (90 - angleLimit) && b < (90 + angleLimit)) {
                    layer.setStyle(style1);
                }else if(b > (0 - angleLimit) && b < (0 + angleLimit)) {
                    layer.setStyle(style2);
                }
            }
        }
    );
    map.addLayer(geojsonTileLayer);

    getPubs(function(data) {
        _(data.response.venues).each(function(item) {
            var content = item.name;
            var m = L.marker([item.location.lat, item.location.lng])
                     .addTo(map)
                     .bindPopup(content);

            m.on('click', function() {
                m.openPopup();
            });

        });
    });

    /**
     * Save location for next reload
     */
    map.on('moveend', function() {
        var data = map.getCenter();
        var centre = JSON.stringify({lat: data.lat, lng: data.lng});
        window.localStorage.setItem('centre', centre);
        window.localStorage.setItem('zoom', map.getZoom());
    });

});


function getPubs(callback) {
    request = new XMLHttpRequest();
    request.open('GET', 'data.json', true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400){
            // Success!
            data = JSON.parse(request.responseText);
            callback(data);
        } else {
            console.error('Error from teh server', request.status);
        }
    };
    request.onerror = function() {
    };
    request.send();
    return request;
}

