import { MessageReaction, User, Message } from "discord.js";
import { spotifyRefresh } from "../../decorators";
import SpotifyWebApi from "spotify-web-api-node";

var WebApiRequest = require('../../../node_modules/spotify-web-api-node/src/webapi-request');
var HttpManager = require('../../../node_modules/spotify-web-api-node/src/http-manager');

function getURI(message: Message) {
    var url = getURL(message);
    var uri = url.split('https://open.spotify.com/track/')[1].split('?')[0];
    return `spotify:track:${uri}`;
};

function getURL(message: Message) {
    var spotifyRegex = /https?:\/\/open\.spotify\.com\/track\/\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    return message.content.match(spotifyRegex)[0];
};

export default {
    description: "Enqueues a song to the user's spotify account",
    execute: async function (reaction: MessageReaction, user: User, api: SpotifyWebApi) {
        spotifyRefresh(
            api,
            async () => enqueueTrack(reaction, api),
            user,
            reaction.message.channel);
    }
}

async function enqueueTrack(reaction: MessageReaction, api: SpotifyWebApi) {
    var accessToken = api.getAccessToken();
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