var SunCalc = require('./app/lib/suncalc');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var ENV = (process.env.ENV || 'dev');

var pubs;

function getAngleRange(date, lat, lng) {
    // Use rough latlng
    var position = SunCalc.getPosition(date, lat, lng);
    var sunAngle = position.azimuth * 180 / Math.PI;
    return [sunAngle  -90 -45, sunAngle -90 + 45];
}

MongoClient.connect('mongodb://localhost/pintsinthesun2_' + ENV, function(err, db) {
    assert.equal(null, err);
    pubs = db.collection('pubs');
    console.log("Connected to Mongodb");

    var lat = 51.52034327025973;
    var lng = -0.1581805944442749;

    var angleRange = getAngleRange(new Date(), lat, lng);

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
    ], function(err, docs) {
        console.error(err);
        console.log(docs);
    });
});
