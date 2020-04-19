var User = require('../../mongo/models/user');

module.exports = {
    name: 'getme',
    description: 'Gets your spotify details',
    async execute(msg, args, api) {
        User.find({ id: msg.author.id }, async function (err, user) {
            if (err) {
                console.log(err);
                msg.channel.send("Oh no! Something went wrong - please don't contact the creator");
            }

            user = user[0];
            api.setAccessToken(user.spotify.accessToken);
            api.setRefreshToken(user.spotify.refreshToken);

            var spotifyDetails = await api.getMe().catch(e => console.log(e));
            msg.channel.send(`Your spotify profile link is ${spotifyDetails.body.external_urls.spotify}`)
        });
    },
};