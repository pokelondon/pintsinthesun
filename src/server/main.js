/*
 * Data persistence service
 * WSP Ltd. 2016
 */

// Libs
// ================================================================
var express = require('express');

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
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
    has_outside_space: Boolean,
    has_garden: Boolean,
    approved: Boolean,
    rejected: Boolean
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

/**
* Look up set of pubs from foursquare near a certain lat/lng
* Cross reference with our DB to generate a merged data set
*/
app.get('/near/:lat/:lng', function(req, res) {

    var lat = Number(req.params.lat);
    var lng = Number(req.params.lng);

    //get pubs around this lat/lng from foursquare
    var url = config.FOURSQUARE_SEARCH_URL + '&ll=' + lat + ',' + lng;
    var pubsResult = fetch(url)
        .then(data => data.json())
        .then(data => data.response.venues)
        .then((foursquarePubs) => {
            //get pubs from the db that match the foursquare IDs we've just obtained
            var foursquareIDs = foursquarePubs.map( pub => pub.id);

            var cursor = pubs.find({"foursquare.id": { $in: foursquareIDs} } );

            var knownPubs = {};
            cursor.each(function(err, dbPub){
                assert.equal(null, err);
                if(dbPub != null){
                    //store pub using its foursquare id as a key for use in next step
                    knownPubs[dbPub.foursquare.id] = dbPub;
                } else {
                    //we have the full list of matching pubs
                    //merge the 2 data sets and return a custom data data structure
                    var results = foursquarePubs.map((foursquarePub) => {
                        var pubApiResult = {
                            foursquareID: foursquarePub.id,
                            name: foursquarePub.name,
                            location: {type: "Point", "coordinates": [ foursquarePub.location.lng, foursquarePub.location.lat ] },
                            distance: foursquarePub.location.distance
                        }

                        //if there is a known pub, cherry pick some data from it and merge
                        var knownPub = knownPubs[foursquarePub.id] || null;
                        if(knownPub) {
                            pubApiResult.has_garden = knownPub.has_garden;
                            pubApiResult.has_outside_space = knownPub.has_outside_space;
                            pubApiResult.approved = knownPub.approved;
                            pubApiResult.rejected = knownPub.rejected;
                            pubApiResult.known = true;
                        }
                        return pubApiResult;
                    });

                    res.json({status: 'ok', items: results});

                }
            });
        })
        .catch( (err) => {
            res.json({status: 'error'});
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
* Return lots of pubs (max 10)
*/
app.get('/pubs', function (req, res) {
    const approved = req.query.approved === 'true';
    const rejected = req.query.rejected === 'true';
    pubs.find({
        approved: approved,
        rejected: rejected
    }).limit(10)
    .toArray(function(err, results){
        if(!err){
            res.send(results);
        }
    });
});


/**
* Accept an array of google place_ids.
* Return location objects that are in the database that match the incoming IDs
*/
app.post('/pub/exists', function(req, res) {

    var ids = req.body;
    var cursor = pubs.find({"googleplaces.id": { $in: ids} } );

    var matching = [];
    cursor.each(function(err, doc){
        assert.equal(null, err);
        if(doc != null){
            matching.push(doc.googleplaces.id);
        } else {
            res.json(matching);
        }
    });
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
* Update a pub
*/
app.patch('/pub/:id', function (req, res) {
    //TODO - requires auth!
    var submittedData = req.body;
    var id = req.params.id;
    var pub = {};

    for(var key in SUBMIT_PROPS) {
        if (submittedData.hasOwnProperty(key)) {
            pub[key] = SUBMIT_PROPS[key](submittedData[key]);
        }
    }

    pubs.update(
        {
            _id: ObjectID(id)
        },
        {
            $set : pub
        },
        function(err, num, obj) {
            assert.equal(null, err);
            res.json({pub: pub, num: num});
        }
    );
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
