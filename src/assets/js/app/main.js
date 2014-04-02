define(['jquery',
        'underscore',
        'OSMBuildings'],
    function($, _, OSMBuildings) {

        var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/1a1b06b230af4efdbb989ea99e9841af/997/256/{z}/{x}/{y}.png';
        var osmUrl = 'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var tileProvider = cloudmadeUrl;

        $(document).ready(function() {
            console.log('dcl');
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
            //window.baseLayer = L.tileLayer(tileProvider).addTo(map);
        });
});
