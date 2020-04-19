var User = require('../../mongo/models/user');
var updateDbToken = require('../../mongo/models/user').updateAccessToken;

module.exports = {
    name: 'share',
    description: 'Shares the current song you are playing on spotify',
    async execute(msg, args, api) {
        User.find({ id: msg.author.id }, async function (err, user) {
            if (err) {
                console.log(err);
                msg.channel.send("Oh no! Something went wrong - please don't contact the creator");
            }

            api.setAccessToken(user[0].spotify.accessToken);
            api.setRefreshToken(user[0].spotify.refreshToken);

            var spotifyDetails = await api.getMyCurrentPlaybackStateMe().catch(e => spotifyDetails = e);
            if (spotifyDetails.statusCode == 401) {
                var refresh = await api.refreshAccessToken().catch(e => console.log(e));
                if (refresh.name === 'WebapiError') { msg.channel.send("Could not authenticate - please relink your account"); }

                api.setAccessToken(refresh.body['access_token']);
                updateDbToken(msg.author.id, refresh.body['access_token']);

                spotifyDetails = await api.getMyCurrentPlaybackState().catch(e => console.log(e))
            }

            if (spotifyDetails.name !== 'WebapiError') {
                msg.channel.send(`You should listen to this! ${spotifyDetails.body.item.external_urls.spotify}`);
            }
            else {
                msg.channel.send("Something went wrong!");
            }

            api.resetAccessToken();
            api.resetRefreshToken();
        });
    },
};