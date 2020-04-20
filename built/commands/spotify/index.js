var SpotifyWebApi = require('spotify-web-api-node');
var Discord = require('discord.js');
var MessageEmbed = require('discord.js').MessageEmbed;
var subCommandList = require('./subcommands');
var subCommands = new Discord.Collection();
require('dotenv').config();
Object.keys(subCommandList).map(function (key) {
    subCommands.set(subCommandList[key].name, subCommandList[key]);
});
// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: 'https://botoxic.hemanthari.com/spotifycallback'
});
module.exports = {
    name: 'spotify',
    description: 'Spotify integration - type "$spotify help" for more.',
    execute: function (msg, args) {
        var subCommand = args[0] || 'help';
        console.log(subCommand);
        if (subCommand === 'help') {
            replyWithSubCommandDescriptions(msg, subCommands);
            return;
        }
        subCommands.get(subCommand).execute(msg, args.shift(), spotifyApi);
    },
};
function replyWithSubCommandDescriptions(msg, commands) {
    var embed = new MessageEmbed();
    commands.map(function (cmd) {
        embed.addField("$spotify " + cmd.name, cmd.description);
    });
    msg.reply(embed);
}
