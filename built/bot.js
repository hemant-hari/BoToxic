"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var Discord = __importStar(require("discord.js"));
var MessageEmbed = require('discord.js').MessageEmbed;
var bot = new Discord.Client();
var commands = new Discord.Collection();
var commands_1 = __importDefault(require("./commands"));
var listeners_1 = __importDefault(require("./listeners"));
Object.keys(commands_1.default).map(function (key) {
    commands.set(commands_1.default[key].name, commands_1.default[key]);
});
var TOKEN = process.env.TOKEN;
bot.login(TOKEN);
bot.on('ready', function () {
    console.info("Logged in as " + bot.user.tag + "!");
});
bot.on('message', function (msg) {
    var args = msg.content.split(/ +/);
    var command = args.shift().toLowerCase();
    listeners_1.default.passthrough(msg);
    if (command.charAt(0) != '$')
        return;
    command = command.substring(1);
    if (command === 'help') {
        replyWithCommandDescriptions(msg, commands);
        return;
    }
    if (msg.author.bot)
        return;
    if (!commands.has(command))
        return;
    if (msg.channel.type === 'dm')
        return;
    try {
        commands.get(command).execute(msg, args);
        msg.react('☣️');
    }
    catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }
});
function replyWithCommandDescriptions(msg, commands) {
    var embed = new MessageEmbed();
    commands.map(function (cmd) {
        embed.addField('$' + cmd.name, cmd.description);
    });
    msg.reply(embed);
}
