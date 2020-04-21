import { Message } from "discord.js";
import SpotifyWebApi from "spotify-web-api-node";
import { autoRefresh } from '../../decorators';

export default {
    name: 'getme',
    description: 'Gets your spotify details',
    async execute(msg: Message, args: string[], api: SpotifyWebApi) {
        let me = await autoRefresh(
            api,
            () => api.getMe(),
            msg.author,
            msg.channel
        );
        msg.channel.send(`Your spotify profile link is ${me.body.external_urls.spotify}`);
    },
};