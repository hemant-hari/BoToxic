import SpotifyWebApi from "spotify-web-api-node";
import { Collection, MessageEmbed, Message } from 'discord.js'

import subCommandList from './subcommands';

var subCommands: any | any = new Collection();

require('dotenv').config();

Object.keys(subCommandList).map(key => {
    subCommands.set(subCommandList[key].name, subCommandList[key]);
});

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: 'https://botoxic.hemanthari.com/spotifycallback'
});

export default {
    name: 'spotify',
    description: 'Spotify integration - type "$spotify help" for more.',
    execute(msg: Message, args: string[]) {
        let subCommand = args[0] || 'help';
        if (subCommand === 'help') {
            replyWithSubCommandDescriptions(msg, subCommands);
            return;
        }
        subCommands.get(subCommand).execute(msg, args.shift(), spotifyApi);
    },
};

function replyWithSubCommandDescriptions(msg, commands) {
    var embed = new MessageEmbed();
    commands.map(cmd => {
        embed.addField("$spotify " + cmd.name, cmd.description);
    });
    msg.reply(embed);
}