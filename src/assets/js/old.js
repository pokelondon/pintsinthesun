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
    window.map = new L.Map('map');

    function centreMap() {
        var centre = {lat: 51.524312, lng: -0.076432};
        var data = window.localStorage.getItem('centre');
        var cachedCentre = JSON.parse(data);
        var zoom = window.localStorage['zoom'] || 18;

        try {
            map.setView(cachedCentre, zoom);

            var polyline = L.polyline([cachedCentre, centre]).addTo(map);
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
    window.baseLayer = L.tileLayer(cloudmadeUrl, {attribution: cloudmadeAttribution}).addTo(map);

    function getRoads() {
        var tilesLoaded = 0;
        var tiles = _(window.baseLayer._tiles).map(function(item) {
            // Find coordinates from currently loaded tiles
            var res = item.src.replace(/.*org\/(.*)\.png/, '$1').split('/');
            res[res.length -1] = res[res.length -1].replace('.png', '');
            return res;
        });

        tileData = [];
        _(tiles).each(function(d) {
            if (d.length >= 9) {
                var url = 'http://tile.openstreetmap.us/vectiles-highroad/' + d[6] + '/' + d[7] + '/' + d[8] + '.json';
                $.ajax({
                    url: url,
                    async: true,
                    success: function(result, textStatus, request) {
                        tilesLoaded ++;
                        tileData = tileData.concat(result.features);
                        console.log((100 * tilesLoaded / tiles.length) + '%');
                        if (tilesLoaded == tiles.length) {
                            console.log('Complete');
                            processData(tileData);
                        }
                    }
                });
            }
        });
    }
    map.on('moveend', function(evt) {
        getRoads();
    });

    function processData(data) {
        var vert = [];
        var horiz = [];
        data.filter(function(d) {
            return d.properties.highway != null
        }).forEach(function(d) {
            var coor = (d.geometry.type == 'LineString' ? d.geometry.coordinates : d.geometry.coordinates[0]);
            for (var i = 1; i < coor.length; i++) {
                var ll0 = coor[i - 1];
                var ll1 = coor[i];
                var b = bearing(ll0[1], ll0[0], ll1[1], ll1[0]);
                var part = [{lng: ll0[0], lat: ll0[1]}, {lng: ll1[0], lat: ll1[1]}];

                var angleLimit = 10;
                if(b > (90 - angleLimit) && b < (90 + angleLimit)) {
                    vert.push(part);
                }else if(b > (0 - angleLimit) && b < (0 + angleLimit)) {
                    horiz.push(part);
                }
            }
        });

        setTimeout(function() {
            window.polylines = window.polylines || [];
            for (var i = 1; i < polylines.length; i++) {
                map.removeLayer(polylines[i]);
            }
            horiz.forEach(function(d) {
                window.polylines.push(L.polyline(d, {color: 'blue'}).addTo(map));
            });
            vert.forEach(function(d) {
                window.polylines.push(L.polyline(d, {color: 'red'}).addTo(map));
            });
        }, 1000);
    }

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
    var centre = map.getCenter();
    var url = 'https://api.foursquare.com/v2/venues/search\?client_id\=FNJEOV4QV4YBMJ4J5EQNKQTCQXOQBCUSIIYIZAXWMKLY5XPN\&client_secret\=NEKCZ4IFX4SOJEPDY2E1ZIV4NTAYZ3GWQHWKKPSQF3KOZKCS\&v\=1396279715756\&ll\=' + centre.lat + '%2C' + centre.lng + '\&radius\=500\&intent\=browse\&limit\=50\&categoryId\=4bf58dd8d48988d11b941735%2C4bf58dd8d48988d116941735'
    request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400){
            // Success!
            data = JSON.parse(request.responseText);
            callback(data);
            window.pubs = data.response.venues;
        } else {
            console.error('Error from teh server', request.status);
        }
    };
    request.onerror = function() {
    };
    request.send();
    return request;
}

