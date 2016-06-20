/*
 * Data persistence service
 * WSP Ltd. 2016
 */

// Libs
// ================================================================
var express = require('express');

var MongoClient = require('mongodb').MongoClient;
var http = require('http');
var assert = require('assert');
var bodyParser = require('body-parser');
var apicache = require('apicache').options({ debug: true });
var apimiddleware = apicache.middleware;
require('es6-promise').polyfill();
require('isomorphic-fetch');

var SunCalc = require('../app/lib/suncalc')

var config = require('./config');


// Configs
// ================================================================
var bind = (process.env.WEBSERVER_PORT || 8080);
var ENV = (process.env.ENV || 'dev');
var ANGLE_RANGE = 100;

var SUBMIT_PROPS = {
    outdoor_angle: Number,
    has_terrace: Boolean,
    has_garden: Boolean,
    is_isolated: Boolean,
    is_in_park: Boolean,
    is_on_hill: Boolean,
    building_to_the_west: Boolean,
}

// Init
// ================================================================
var app = express();
var httpServer = http.Server(app);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(express.static('../build'));
app.use(express.static('../public'));


var pubs;

MongoClient.connect('mongodb://localhost/pintsinthesun2_' + ENV, function(err, db) {
    assert.equal(null, err);
    pubs = db.collection('pubs');
    console.log("Connected to Mongodb");
});

// State
// ================================================================
var connections = 0;

function getAngleRange(date, lat, lng) {
    // Use rough latlng
    var position = SunCalc.getPosition(date, lat, lng);
    var sunAngle = position.azimuth * 180 / Math.PI;
    return [sunAngle - 90 - (ANGLE_RANGE/2), sunAngle - 90 + (ANGLE_RANGE/2)];
}

// Views + endpoints
// ================================================================
app.get('/near/:lat/:lng/:date?', function(req, res) {
    var date, angleRange;
    var lat = Number(req.params.lat);
    var lng = Number(req.params.lng);
    var query = {
        "location.type": "Point"
    }

    if(req.params.date) {
        date = new Date(req.params.date);
        angleRange = getAngleRange(date, lat, lng);
        query.outdoor_angle = { $gt: angleRange[0], $lt: angleRange[1] };
    }

    pubs.aggregate([
        {
            $geoNear: {
                near: { type: 'Point', coordinates: [ lng, lat ] },
                maxDistance: 3000,
                distanceField: 'distance',
                spherical: true,
                query: query
            },
        },
        {
            $sort: { distance: 1 }
        }
    ], function(err, docs) {
        if(err) {
            res.json({error: err.errmsg}, 500);
        }
        var results = {items: docs};
        if(date) {
            results.date = date.toISOString();
        }
        res.json(results);
    });
});


/**
* Accept an array of foursquare IDs.
* Return location objects that are in the database that match the incoming IDs
*/
app.post('/pub/exists', function(req, res) {

    var ids = req.body;
    var cursor = pubs.find({"foursquare.id": { $in: ids} } );

    var matching = [];
    cursor.each(function(err, doc){
        assert.equal(null, err);
        if(doc != null){
            matching.push(doc);
        } else {
            res.json(matching);
        }
    });
});

app.get('/pub/:id', function(req, res) {
    pubs.findOne({"foursquare.id": req.params.id}, function(err, pub) {
        assert.equal(null, err);
        res.json({pub: pub});
    })
});



app.post('/pub/:id', function(req, res) {
    var submittedData = req.body;
    var foursquareID = req.params.id;
    var pub = {}

    for(var key in SUBMIT_PROPS) {
        if (submittedData.hasOwnProperty(key)) {
            pub[key] = SUBMIT_PROPS[key](submittedData[key]);
        }
    }

    fetch(config.FOURSQUARE_VENUE_URL + foursquareID + config.FOURSQUARE_CREDS)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            pub.foursquare = {id: foursquareID};
            pub.name = data.response.venue.name;
            pub.location = {
                type: 'Point',
                coordinates: [
                    data.response.venue.location.lng,
                    data.response.venue.location.lat
                ]
            };
            //res.json(pub);
            return pub
        }).then(function(pub) {
            pubs.update({
                "foursquare.id": req.params.id},
                pub,
                {upsert: true},
                function(err, num, obj) {
                    assert.equal(null, err);
                    res.json({pub: pub, res: num});
                }
            );
        }).catch(function(err) {
            console.error(err);
        });
});

app.get('/weather/:lat/:lng', apimiddleware('10 minutes'), function(req, res) {
    var lat = Number(req.params.lat);
    var lng = Number(req.params.lng);
    var url = 'https://api.forecast.io/forecast/' + config.DARK_SKY_KEY + '/' + lat + ',' + lng;

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var ret = data.hourly.data.map(point => {
                var date = new Date(point.time * 1000);
                var hour = date.getHours();
                return {
                    hour: hour,
                    time: point.time,
                    summary: point.summary,
                    icon: point.icon
                };
            });
            console.log(ret);
            res.json(ret);
        });
});

// Web server for API Endpoints
// ================================================================
httpServer.listen(bind, function () {
    console.log('Web Server listening at http://%s:%s', 'localhost', bind);
});
