"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
var discord_js_1 = require("discord.js");
var subcommands_1 = __importDefault(require("./subcommands"));
var subCommands = new discord_js_1.Collection();
require('dotenv').config();
Object.keys(subcommands_1.default).map(function (key) {
    subCommands.set(subcommands_1.default[key].name, subcommands_1.default[key]);
});
// credentials are optional
var spotifyApi = new spotify_web_api_node_1.default({
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: 'https://botoxic.hemanthari.com/spotifycallback'
});
exports.default = {
    name: 'spotify',
    description: 'Spotify integration - type "$spotify help" for more.',
    execute: function (msg, args) {
        var subCommand = args[0] || 'help';
        if (subCommand === 'help') {
            replyWithSubCommandDescriptions(msg, subCommands);
            return;
        }
        subCommands.get(subCommand).execute(msg, args.shift(), spotifyApi);
    },
};
function replyWithSubCommandDescriptions(msg, commands) {
    var embed = new discord_js_1.MessageEmbed();
    commands.map(function (cmd) {
        embed.addField("$spotify " + cmd.name, cmd.description);
    });
    msg.reply(embed);
}
