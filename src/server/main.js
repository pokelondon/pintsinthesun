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
        },
        {
            $match: {approved: true}
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
* Return one pub by its google ID
*/
app.get('/pub/:id', function(req, res) {
    pubs.findOne({"googleplaces.id": req.params.id}, function(err, pub) {
        assert.equal(null, err);
        res.json({pub: pub});
    })
});


/**
* Save a pub
*/
app.post('/pub/:id', function(req, res) {
    var submittedData = req.body;
    var googlePlaceID = req.params.id;
    var pub = {}

    fetch(config.GOOGLE_PLACES_API + '&placeid=' + googlePlaceID)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            pubs.update({
                "googleplaces.id": req.params.id},
                {
                    $set: {
                        googleplaces: {
                            id: googlePlaceID,
                            url: data.result.url
                        },
                        has_outside_space: submittedData.has_outside_space,
                        has_garden: submittedData.has_garden,
                        outdoor_angle: submittedData.outdoor_angle,
                        name: data.result.name,
                        location: {
                            type: 'Point',
                            coordinates: [
                                data.result.geometry.location.lng,
                                data.result.geometry.location.lat,
                            ]
                        },
                        approved: false,
                        rejected: false,
                    },
                    $currentDate: {
                        lastModified: true
                    }
                },
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


/**
* Get weather
*/
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
            res.json(ret);
        });
});

// Web server for API Endpoints
// ================================================================
httpServer.listen(bind, function () {
    console.log('Web Server listening at http://%s:%s', 'localhost', bind);
});
