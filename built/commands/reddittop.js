"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var discord_js_1 = require("discord.js");
exports.default = {
    name: 'rtop',
    description: 'Grabs the top reddit post for the given subreddit',
    execute: function (msg, args) {
        if (args.length <= 0)
            return;
        axios_1.default.get('https://reddit.com/r/' + args[0] + '.json')
            .then(function (res) {
            var posts = res.data.data.children;
            var responsePost = (posts[0].data.stickied == false
                ? posts[0]
                : posts[1].data.stickied
                    ? posts[2]
                    : posts[1]).data;
            if (responsePost.over_18) {
                msg.channel.send("Not on my good christian server.");
                return;
            }
            var embed = new discord_js_1.MessageEmbed();
            embed
                .setTitle(responsePost.title)
                .setDescription("https://reddit.com" + responsePost.permalink)
                .setAuthor(responsePost.author);
            if (responsePost.url.includes("jpg")
                || responsePost.url.includes("png")
                || responsePost.url.includes("imgur")
                || responsePost.url.includes("gfycat")
                || responsePost.url.includes("giphy")) {
                embed.setImage(responsePost.url);
            }
            msg.channel.send(embed);
        })
            .catch(function (err) {
            msg.channel.send('Oh no! Something went wrong :(');
            console.log(err);
        });
    },
};
