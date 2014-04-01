document.addEventListener('DOMContentLoaded', function() {
    var map = new L.Map('map')

    function centreMap() {
        var centre = {lat: 51.524312, lng: -0.076432};
        var data = window.localStorage.getItem('centre');
        var cachedCentre = JSON.parse(data);
        var zoom = window.localStorage['zoom'] || 19;

        try {
            map.setView(cachedCentre, zoom);
        } catch(e) {
            map.setView(centre, zoom);
        }
    }
    centreMap();

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

