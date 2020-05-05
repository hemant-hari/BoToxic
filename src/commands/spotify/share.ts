import { spotifyRefresh } from '../../decorators';
import { Message, TextChannel } from 'discord.js';
import SpotifyWebApi from 'spotify-web-api-node';
import { getArchive } from '../../mongo/models/guildconfig';

export default {
    name: 'share',
    description: 'Shares the current song you are playing on spotify',
    async execute(msg: Message, args: string[], api: SpotifyWebApi) {
        let archiveChannel = getArchive(msg.guild.id);
        let state = spotifyRefresh(
            api,
            () => api.getMyCurrentPlaybackState(),
            msg.author,
            msg.channel);

        Promise.all([archiveChannel, state]).then(([archiveChannel, state]) => {
            let msgStr = `You should listen to this! ${state.body.item.external_urls.spotify}`;
            msg.channel.send(msgStr);
            if (archiveChannel) {
                msg.delete({ timeout: 3600 * 1000 });
                (<TextChannel>msg.guild.channels.cache.get(archiveChannel)).send(msgStr);
            }
        })
    },
};