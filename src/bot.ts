require('dotenv').config();
import * as Discord from 'discord.js';
var MessageEmbed = require('discord.js').MessageEmbed;
const bot = new Discord.Client();
let commands: string | any = new Discord.Collection();
import botCommands from './commands';
import botListeners from './listeners';

Object.keys(botCommands).map(key => {
    commands.set(botCommands[key].name, botCommands[key]);
});

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);
bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    const args: string[] = msg.content.split(/ +/);
    var command = args.shift().toLowerCase();

    botListeners.passthrough(msg);

    if (command.charAt(0) != '$') return;
    command = command.substring(1);

    if (command === 'help') {
        replyWithCommandDescriptions(msg, commands);
        return;
    }

    if (msg.author.bot) return;
    if (!commands.has(command)) return;
    if (msg.channel.type === 'dm') return;

    try {
        commands.get(command).execute(msg, args);
        msg.react('☣️');
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }
});

function replyWithCommandDescriptions(msg, commands) {
    var embed = new MessageEmbed();
    commands.map(cmd => {
        embed.addField('$' + cmd.name, cmd.description);
    });
    msg.reply(embed);
}