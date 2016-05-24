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

var SunCalc = require('./app/lib/suncalc')

// Configs
// ================================================================
var bind = (process.env.WEBSERVER_PORT || 8080);
var ENV = (process.env.ENV || 'dev');


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
    return [sunAngle  -90 -45, sunAngle -90 + 45];
}

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

// Views + endpoints
// ================================================================

// Web server for API Endpoints
// ================================================================
httpServer.listen(bind, function () {
    console.log('Web Server listening at http://%s:%s', 'localhost', bind);
});

