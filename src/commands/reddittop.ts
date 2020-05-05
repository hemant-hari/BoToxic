import axios from 'axios';
import { Message, MessageEmbed } from 'discord.js';

export default {
    name: 'rtop',
    description: 'Grabs the top reddit post for the given subreddit',
    execute: async (msg: Message, args: string[]) => {
        try {
            if (args.length <= 0) return;
            var res = await axios.get('https://reddit.com/r/' + args[0] + '.json')

            var posts = res.data.data.children;
            var responsePost
                = (posts[0].data.stickied == false
                    ? posts[0]
                    : posts[1].data.stickied
                        ? posts[2]
                        : posts[1]).data;

            if (responsePost.over_18) {
                msg.channel.send("Not on my good christian server.");
                return;
            }

            var embed =
                new MessageEmbed()
                    .setTitle(responsePost.title)
                    .setDescription("https://reddit.com" + responsePost.permalink)
                    .setAuthor(responsePost.author)

            if (responsePost.url.includes("jpg")
                || responsePost.url.includes("png")
                || responsePost.url.includes("imgur")
                || responsePost.url.includes("gfycat")
                || responsePost.url.includes("giphy")) {
                embed.setImage(responsePost.url);
            }

            msg.channel.send(embed);
        } catch (err) {
            msg.channel.send('Oh no! Something went wrong :(');
            console.log(err);
        }
    },
};