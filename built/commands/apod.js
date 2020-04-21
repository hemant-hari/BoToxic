"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var discord_js_1 = require("discord.js");
exports.default = {
    name: 'apod',
    description: 'Grabs the Astronomy Picture Of the Day from NASA (Optionally input date in YYYY-MM-DD format)',
    execute: function (msg, args) {
        var date = args.length >= 1 ? "&date=" + args[0] : "";
        axios_1.default.get("https://api.nasa.gov/planetary/apod?api_key=" + process.env.NASA_TOKEN + date)
            .then(function (response) {
            var embed = new discord_js_1.MessageEmbed();
            embed
                .setTitle(response.data.title)
                .setDescription(response.data.explanation);
            if (response.data.media_type === "image") {
                embed.setImage(response.data.url);
            }
            else {
                embed.setURL(response.data.url);
            }
            msg.channel.send(embed);
        })
            .catch(function (err) {
            msg.channel.send('Oh no! Something went wrong :(');
            console.log(err);
        });
    },
};
