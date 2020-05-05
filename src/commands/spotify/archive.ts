import { Message } from 'discord.js';
import SpotifyWebApi from 'spotify-web-api-node';
import { setArchive } from '../../mongo/models/guildconfig';

export default {
    name: 'archive',
    description: 'Archives shared spotify songs to the mentioned channel after a pre-set delay.'
        + ' Include "disable" in the command to disable this feature',
    async execute(msg: Message, args: string[], api: SpotifyWebApi) {
        let archiveChannel = msg.mentions.channels.first();
        if (msg.content.includes("disable")) {
            setArchive(msg.guild.id, null, false);
            msg.channel.send("Spotify archiving disabled.")
            return;
        }
        if (archiveChannel.type === "text") {
            setArchive(msg.guild.id, archiveChannel.id, true)
                .then(() => msg.channel.send("Spotify shares will now be archived to the mentioned channel after 1 hour."))
                .catch(err => {
                    console.log(err);
                    msg.channel.send("Something went wrong setting the channel!");
                });
        } else {
            msg.channel.send("Please mention a *text channel* you'd like to archive to");
        }
    },
};