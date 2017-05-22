//var data = require('./public/data/results.json');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var ENV = (process.env.ENV || 'dev');

var data = {
    "items": [
        {
            "foursquare": { "id" : "51605f56e4b024efa71a9873" },
            "has_outside_space": true,
            "has_garden": false,
            "suggest_count": 1,
            "approved": false,
            "rejected": false,
        },
        {
            "foursquare": { "id" : "507dde91e412203dde77efb6" },
            "has_outside_space" : true,
            "has_garden" : false,
            "suggest_count": 1,
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
        console.log('Result', res, err);
    }).catch(function(err) {
        console.log('error', err);
        err.writeErrors.forEach(function(error) {
            console.error(error.errmsg);
        });
    });

    // console.log('Creating 2dsphere index');
    // pubs.createIndex( { location : "2dsphere" } );

    console.log('Creating foursquare places unique index');
    pubs.createIndex( { "foursquare.id": 1 }, { unique: true });

    console.log('Querying');
    pubs.find().toArray(function(err, data) {
        console.log(data);
    });
});
