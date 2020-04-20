var axios = require('axios');
var MessageEmbed = require('discord.js').MessageEmbed;
module.exports = {
    name: 'rtop',
    description: 'Grabs the top reddit post for the given subreddit',
    execute: function (msg, args) {
        if (args.length <= 0)
            return;
        axios.get('https://reddit.com/r/' + args[0] + '.json')
            .then(function (res) {
            var posts = res.data.data.children;
            var responsePost = (posts[0].data.stickied == false
                ? posts[0]
                : posts[1].data.stickied
                    ? posts[2]
                    : posts[1]).data;
            var embed = new MessageEmbed();
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
