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
    building_to_the_west: Boolean
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
app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/public'));


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
app.get('/near/:lat/:lng/:date', function(req, res) {
    var lat = Number(req.params.lat);
    var lng = Number(req.params.lng);
    var date = new Date(req.params.date);
    var angleRange = getAngleRange(date, lat, lng);

    pubs.aggregate([
        {
            $geoNear: {
                near: { type: 'Point', coordinates: [ lng, lat ] },
                maxDistance: 30000,
                distanceField: 'distance',
                spherical: true,
                query: { "location.type": "Point",
                        outdoor_angle: { $gt: angleRange[0], $lt: angleRange[1] }, }
            },
        },
        {
            $sort: { distance: 1 }
        }
    ], function(err, docs) {
        if(err) {
            res.json({error: err.errmsg}, 500);
        }
        res.json({items: docs});
    });
});

app.get('/pub/:id', function(req, res) {
    pubs.findOne({"foursquare.id": req.params.id}, function(err, obj) {
        assert.equal(null, err);
        res.json(obj);
    })
});

app.put('/pub/:id', function(req, res) {
    var update = {
        outdoor_angle: req.body.outdoor_angle,
        has_terrace: req.body.has_terrace,
    }
    pubs.update({
        "foursquare.id": req.params.id},
        update,
        function(err, num, obj) {
            assert.equal(null, err);
            res.json(obj);
        }
    );
});

app.post('/pub/create/:id', function(req, res) {
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
                    console.log(num, obj);
                    res.json({pub: pub, res: num});
                }
            );
        }).catch(function(err) {
            console.error(err);
        });
});

// Web server for API Endpoints
// ================================================================
httpServer.listen(bind, function () {
    console.log('Web Server listening at http://%s:%s', 'localhost', bind);
});

