import { spotifyRefresh } from '../../decorators';
import { Message, TextChannel } from 'discord.js';
import SpotifyWebApi from 'spotify-web-api-node';
import { getArchiveConfig } from '../../mongo/models/guildconfig';

export default {
    name: 'share',
    description: 'Shares the current song you are playing on spotify',
    async execute(msg: Message, args: string[], api: SpotifyWebApi) {
        let guildCfg = getArchiveConfig(msg.guild.id);
        let state = spotifyRefresh(
            api,
            () => api.getMyCurrentPlaybackState(),
            msg.author,
            msg.channel);

        Promise.all([guildCfg, state]).then(([guildCfg, state]) => {
            let msgStr = `You should listen to this! ${state.body.item.external_urls.spotify}`;
            msg.channel.send(msgStr);
            if (guildCfg.spotify.archive) {
                msg.delete({ timeout: guildCfg.spotify.expiry * 1000 });
                (<TextChannel>msg.guild.channels.cache.get(guildCfg.spotify.archiveChannel)).send(`${msgStr} - Shared by <@${msg.author}>`);
            }
        })
    },
};