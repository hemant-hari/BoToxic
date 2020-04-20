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

export default User;

export async function updateAccessToken(id: string, accessToken: string) {
    return User.update(
        { id },
        { $set: { "spotify.accessToken": accessToken } }
    );
};