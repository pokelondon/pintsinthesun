var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

const schema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    gender: String,
    address: String
});

schema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
schema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', schema);