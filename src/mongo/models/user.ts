import { Schema, model } from 'mongoose';

var userObject = {
    id: { type: String, unique: true },
    username: { type: String, index: true },
    spotify: {
        accessToken: String,
        refreshToken: String,
        expiry: Number,
    },
};
var userSchema = new Schema(userObject);
var User = model('User', userSchema);

export default User;

export var DbUser = User;

export async function updateAccessToken(id: string, accessToken: string, expiry: number = 3600) {

    return User.update(
        { id },
        {
            $set: {
                "spotify.accessToken": accessToken,
                "spotify.expiry": Date.now() + expiry,
            }
        }
    );
};