import { Message } from "discord.js";
import SpotifyWebApi from 'spotify-web-api-node';
import reactions from './reactions';

require('dotenv').config();

var api = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: 'https://botoxic.hemanthari.com/spotifycallback'
});

export default {
    description: "Listens for spotify links for spotify integration integration",
    listen: function (msg: Message) {
        reactions.react(msg);
        var reactionListener = msg.createReactionCollector((reactions.filter), { time: 10 * 60 * 60 * 1000 });
        reactionListener.on('collect', (reaction, user) => reactions.handle(reaction, user, api));
    }
}