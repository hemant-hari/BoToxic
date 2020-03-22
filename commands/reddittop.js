const axios = require('axios');
const MessageEmbed = require('discord.js').MessageEmbed;

module.exports = {
	name: 'rtop',
    description: 'Grabs the top reddit post for the given subreddit',
	execute(msg, args) {
        if (args.length <= 0) return;
        console.log(args);
        axios.get('http://reddit.com/r/' + args[0] + '.json')
            .then(res => {
                var posts = res.data.data.children;
                var responsePost
                    = (posts[0].data.stickied == false
                        ? posts[0]
                        : posts[1].data.stickied
                            ? posts[2]
                            : posts[1]).data;
                
                var embed = new MessageEmbed();
                embed
                    .setTitle(responsePost.title)
                    .setDescription(responsePost.url)
                    .setAuthor(responsePost.author)
                if (responsePost.url.includes("jpg")){
                    embed.attachFiles(responsePost.url);
                }
                msg.channel.send(embed);
            })
            .catch(err => {
                msg.channel.send('Oh no! Something went wrong :(');
                console.log(err);
            });
	},
};