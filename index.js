require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');

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
    if (command.charAt(0) != '$') return;
    command = command.substring(1);

    console.info(`Called command: ${command}`);

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