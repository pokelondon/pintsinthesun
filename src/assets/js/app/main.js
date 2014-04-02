define(['jquery',
        'underscore',
        'OSMBuildings'],
    function($, _, OSMBuildings) {

        var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/1a1b06b230af4efdbb989ea99e9841af/997/256/{z}/{x}/{y}.png';
        var osmUrl = 'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var mapBoxUrl = 'https://a.tiles.mapbox.com/v3/errkk.hmcik8n5/{z}/{x}/{y}.png'
        var tileProvider = mapBoxUrl;

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

        $(document).ready(function() {
            window.map = new L.Map('map');

            function centreMap() {
                var centre = {lat: 51.524312, lng: -0.076432};
                var data = window.localStorage.getItem('centre');
                var cachedCentre = JSON.parse(data);
                var zoom = window.localStorage['zoom'] || 18;

                try {
                    map.setView(cachedCentre, zoom);
                } catch(e) {
                    map.setView(centre, zoom);

                    if(navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            centre.lat = position.coords.latitude;
                            centre.lng = position.coords.longitude;
                            map.setView(centre, zoom);
                        });
                    }
                }
            }
            centreMap();

            function setupBuildings() {
                var osmb = new OSMBuildings(map).loadData();
                var d = new Date(2014, 3, 1, 11, 0);
                var $timeEl = $('#time');
                var $hourEl = $('#hour');
                var $minsEl = $('#mins');
                $timeEl.on('change', function() {
                    var hour = $timeEl.val();
                    var wholeHour = Math.floor(hour);
                    var mins = 0;
                    if(hour > wholeHour) {
                        mins = 30;
                    }
                    var d = new Date(2014, 3, 1, hour, mins);
                    $hourEl.text(wholeHour);
                    $minsEl.text(mins ? mins : '00');
                    osmb.setDate(d);
                });

                osmb.setDate(d);
                osmb.setStyle({'roofColor': '#aaaaaa', 'wallColor': '#aaaaaa'});
            }
            setupBuildings();

            // Raster base layer
            window.baseLayer = L.tileLayer(tileProvider).addTo(map);

            $('.js-load-pubs').on('click', function(evt) {
                evt.preventDefault();
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
});
