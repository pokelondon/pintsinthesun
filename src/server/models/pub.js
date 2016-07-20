var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Pub',{
    _id: Schema.Types.ObjectId,
    outdoor_angle: Number,
    has_terrace: Boolean,
    has_garden: Boolean,
    is_isolated: Boolean,
    is_in_park: Boolean,
    is_on_hill: Boolean,
    building_to_the_west: Boolean,
    foursquare: Schema.Types.Mixed,
    name: String,
    location: Schema.Types.Mixed
});