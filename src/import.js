//var data = require('./public/data/results.json');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var ENV = (process.env.ENV || 'dev');

var data = {
    "items": [
        {
            "googleplaces": { "id" : "ChIJy4q69s0adkgRLSZ4NUqrXjY" },
            "has_outside_space": true,
            "has_garden": false,
            "outdoor_angle" : -97,
            "name": "The Gunmakers",
            "location": { "type" : "Point", "coordinates" : [ -0.1531723, 51.519231 ] },
            "approved": false,
            "rejected": false,
        },
        {
            "googleplaces": { "id" : "ChIJo4s4080adkgRZXhdFhSl-ww" },
            "has_outside_space" : true,
            "has_garden" : false,
            "outdoor_angle": -14,
            "name": "THE BARLEY MOW",
            "location": { "type" : "Point", "coordinates" : [ -0.1556608, 51.5196788 ] },
            "approved": false,
            "rejected": false,
        }
    ]
};

MongoClient.connect('mongodb://localhost/pintsinthesun2_' + ENV, function(err, db) {
    assert.equal(null, err);
    pubs = db.collection('pubs');
    console.log("Connected to Mongodb");

    console.log("Removing data");
    pubs.remove();

    console.log(`Inserting ${data.items.length} items`);

    var res = pubs.insert(data.items).then(function(err, res) {
        console.log(res, err);
    }).catch(function(err) {
        err.writeErrors.forEach(function(error) {
            console.error(error.errmsg);
        });
    });

    console.log('Creating 2dsphere index');
    pubs.createIndex( { location : "2dsphere" } );

    console.log('Creating google places unique index');
    pubs.createIndex( { "googleplaces.id": 1 }, { unique: true });

    console.log('Querying');
    pubs.find().toArray(function(err, data) {
        console.log(data);
    });
});
