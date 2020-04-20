require('dotenv').config();
var Discord = require('discord.js');
var MessageEmbed = require('discord.js').MessageEmbed;
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');
const botListeners = require('./listeners');

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
});

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);
bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    const args = msg.content.split(/ +/);
    var command = args.shift().toLowerCase();

    botListeners.passthrough(msg);

    if (command.charAt(0) != '$') return;
    command = command.substring(1);

    if (command === 'help') {
        replyWithCommandDescriptions(msg, bot.commands);
        return;
    }

    if (msg.author.bot) return;
    if (!bot.commands.has(command)) return;
    if (msg.channel.type === 'dm') return;

    try {
        bot.commands.get(command).execute(msg, args);
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