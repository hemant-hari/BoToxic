var User = require('../../mongo/models/user');
var updateDbToken = require('../../mongo/models/user').updateAccessToken;
var WebApiRequest = require('../../../node_modules/spotify-web-api-node/src/webapi-request');
HttpManager = require('../../../node_modules/spotify-web-api-node/src/http-manager');

function getURI(message) {
    var url = getURL(message);
    var uri = url.split('https://open.spotify.com/track/')[1].split('?')[0];
    return `spotify:track:${uri}`;
};

function getURL(message) {
    var spotifyRegex = /https?:\/\/open\.spotify\.com\/track\/\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    return message.content.match(spotifyRegex)[0];
};

module.exports = {
    description: "Enqueues a song to the user's spotify account",
    execute: async function (reaction, user, api) {
        try {
            var user = await User.findOne({ id: user.id });
            api.setAccessToken(user.spotify.accessToken);
            api.setRefreshToken(user.spotify.refreshToken);
        } catch {
            reaction.message.channel.send("Something went wrong retrieving your spotify data, have you linked your account?");
            return;
        }

        try {
            var response = await enqueueTrack(reaction, user.spotify.accessToken).catch(e => response = e);
            if (response.statusCode == 401) {
                var refresh = await api.refreshAccessToken().catch(e => refresh = e);
                if (refresh.name === 'WebapiError') { msg.channel.send("Could not authenticate - please relink your account"); }

                api.setAccessToken(refresh.body['access_token']);
                updateDbToken(user.id, refresh.body['access_token']);
                response = enqueueTrack(reaction, user.spotify.accessToken).catch(e => console.log(e))
            }

            api.resetAccessToken();
            api.resetRefreshToken();
        } catch (e) {
            console.log(e);
        }
    }
}

async function enqueueTrack(reaction, accessToken) {
    return (
        WebApiRequest.builder(accessToken)
            .withPath('/v1/me/player/queue')
            .withHeaders({ 'Content-Type': 'application/json' })
            .withQueryParameters({
                uri: getURI(reaction.message)
            })
            .build()
            .execute(HttpManager.post, null)
    );
}