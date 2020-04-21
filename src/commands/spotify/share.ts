import { spotifyRefresh } from '../../decorators';
import { Message } from 'discord.js';
import SpotifyWebApi from 'spotify-web-api-node';

export default {
    name: 'share',
    description: 'Shares the current song you are playing on spotify',
    async execute(msg: Message, args: string[], api: SpotifyWebApi) {
        let state = await spotifyRefresh(
            api,
            () => api.getMyCurrentPlaybackState(),
            msg.author,
            msg.channel);
        msg.channel.send(`You should listen to this! ${state.body.item.external_urls.spotify}`);
    },
};