define([
        'jquery',
        'underscore',
        'OSMBuildings',
        'slider',
        'moment'
    ], function($, _, OSMBuildings, Slider, moment) {

        var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/1a1b06b230af4efdbb989ea99e9841af/997/256/{z}/{x}/{y}.png';
        var osmUrl = 'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var mapBoxUrl = 'https://a.tiles.mapbox.com/v3/errkk.hmcik8n5/{z}/{x}/{y}@2x.png'
        var tileProvider = mapBoxUrl;

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

                function centreCurrentLocation(callback) {
                    if(navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            var centre = {};
                            centre.lat = position.coords.latitude;
                            centre.lng = position.coords.longitude;
                            map.setView(centre, zoom);
                            if('function' === typeof callback) {
                                callback(centre);
                            }
                        });
                    }
                }

                try {
                    map.setView(cachedCentre, zoom);
                } catch(e) {
                    map.setView(centre, zoom);
                    centreCurrentLocation();
                }

                // Bind button
                var $btnLocate = $('.js-locate-me');
                $btnLocate.on('click', function(evt) {
                    evt.preventDefault();
                    $btnLocate.addClass('is-loading');
                    centreCurrentLocation(function() {
                        $btnLocate.removeClass('is-loading');
                    });
                });


            }
            centreMap();

            function setupBuildings() {
                var osmb = new OSMBuildings(map).loadData();
                var m = moment();
                m.hour(11).minute(0).second(0);
                var duration = moment.duration(8, 'hours').asSeconds();
                var $time = $('.js-slider-time');
                var $clock = $('.js-clock');

                function setClock(mObj) {
                    $clock.text(mObj.format("H:mm a"));
                    osmb.setDate(mObj.toDate());
                }

                var slider = new Slider($time, function(data) {
                    var newM = m.clone().add(duration * data / 100, 'seconds');
                    setClock(newM);
                });

                setClock(m);

                osmb.setStyle({'roofColor': '#aaaaaa', 'wallColor': '#aaaaaa'});
            }
            setupBuildings();

            // Raster base layer
            window.baseLayer = L.tileLayer(tileProvider).addTo(map);

            // Load pubs button
            var $loadPubs = $('.js-load-pubs');
            $loadPubs.on('click', function(evt) {
                evt.preventDefault();

                $loadPubs.addClass('is-loading');

                getPubs(function(data) {
                    $loadPubs.removeClass('is-loading');
                    _(data.response.venues).each(function(item) {
                        var m = L.marker([item.location.lat, item.location.lng], {icon: pintIcon})
                                .addTo(map)
                                .bindPopup(item.name);
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

            // Bind button
            var $btnOverlay = $('.js-open-modal');
            $btnOverlay.on('click', function(evt) {
                evt.preventDefault();
                $('.js-modal').toggleClass('is-open');
            });
            var $btnCloseOverlay = $('.js-close-modal');
            $btnCloseOverlay.on('click', function(evt) {
                evt.preventDefault();
                $('.js-modal').removeClass('is-open');
            });
        });


    init();


    function init() {
      if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
        window.addEventListener('devicemotion', _.throttle(deviceMotionHandler,500), false);
      } else {
        document.getElementById("dmEvent").innerHTML = "Not supported on your device or browser.  Sorry."
      }
    }

    function deviceMotionHandler(eventData) {
      var info, xyz = "[X, Y, Z]";

      // Grab the acceleration including gravity from the results
      var acceleration = eventData.compassHeading || eventData.webkitCompassHeading || 0;
      info = xyz.replace("X", round(acceleration.x));
      info = info.replace("Y", round(acceleration.y));
      info = info.replace("Z", round(acceleration.z));
      document.getElementById("moAccel").innerHTML = info;

      // Grab the acceleration including gravity from the results
      acceleration = eventData.accelerationIncludingGravity;
      info = xyz.replace("X", round(acceleration.x));
      info = info.replace("Y", round(acceleration.y));
      info = info.replace("Z", round(acceleration.z));
      document.getElementById("moAccelGrav").innerHTML = info;

      // Grab the acceleration including gravity from the results
      var rotation = eventData.rotationRate;
      info = xyz.replace("X", round(rotation.alpha));
      info = info.replace("Y", round(rotation.beta));
      info = info.replace("Z", round(rotation.gamma));
      document.getElementById("moRotation").innerHTML = info;

      info = eventData.interval;
      document.getElementById("moInterval").innerHTML = info;
    }

    function round(val) {
      var amt = 10;
      return Math.round(val * amt) /  amt;
    }


});
