var User = require('../../mongo/models/user');
var updateDbToken = require('../../mongo/models/user').updateAccessToken;

module.exports = {
    name: 'getme',
    description: 'Gets your spotify details',
    async execute(msg, args, api) {
        User.find({ id: msg.author.id }, async function (err, user) {
            if (err) {
                console.log(err);
                msg.channel.send("Oh no! Something went wrong - please don't contact the creator");
            }

            api.setAccessToken(user[0].spotify.accessToken);
            api.setRefreshToken(user[0].spotify.refreshToken);

            var spotifyDetails = await api.getMe().catch(e => spotifyDetails = e);
            if (spotifyDetails.statusCode == 401) {
                var refresh = await api.refreshAccessToken().catch(e => refresh = e);
                if (refresh.name === 'WebapiError') { msg.channel.send("Could not authenticate - please relink your account"); }

                api.setAccessToken(refresh.body['access_token']);
                updateDbToken(msg.author.id, refresh.body['access_token']);
                spotifyDetails = await api.getMe().catch(e => console.log(e))
            }

            if (spotifyDetails.name !== 'WebapiError') {
                msg.channel.send(`Your spotify profile link is ${spotifyDetails.body.external_urls.spotify}`)
            }
            else {
                msg.channel.send("Something went wrong!");
            }

            api.resetAccessToken();
            api.resetRefreshToken();
        });
    },
};