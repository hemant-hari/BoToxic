var mongoose = require('mongoose');

var userObject = {
    id: { type: String, index: true },
    username: { type: String, unique: true },
    spotify: {
        accessToken: String,
        refreshToken: String,
        expiry: String,
    },
};
var userSchema = mongoose.Schema(userObject);

module.exports = mongoose.model('User', userSchema);