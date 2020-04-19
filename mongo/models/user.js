var mongoose = require('mongoose');

var userObject = {
    id: { type: String, unique: true },
    username: { type: String, index: true },
    spotify: {
        accessToken: String,
        refreshToken: String,
        expiry: String,
    },
};
var userSchema = mongoose.Schema(userObject);
var User = mongoose.model('User', userSchema);

module.exports = User;

module.exports.updateAccessToken = async function (userId, accessToken) {
    var callback;
    User.update(
        { id },
        { spotify: { accessToken } },
        (err, raw) => callback = { err, raw }
    );

    return callback;
};