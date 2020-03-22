const axios = require('axios');
const MessageEmbed = require('discord.js').MessageEmbed;

module.exports = {
	name: 'apod',
    description: 'Grabs the Astronomy Picture Of the Day from NASA',
	execute(msg, args) {
        var date = "";
        if (args.length >= 1){
            date = "&date=" + args[0];
        }
        axios.get("https://api.nasa.gov/planetary/apod?api_key=" + process.env.NASA_TOKEN + date)
            .then(response => {
                console.log(response);
                var embed = new MessageEmbed();
                embed
                    .setTitle(response.data.title)
                    .setDescription(response.data.explanation);
                if (response.data.media_type === "image"){
                    embed.setImage(response.data.url);
                }
                else{
                    embed.setURL(response.data.url)
                }
                msg.channel.send(embed);
            })
            .catch(err => {
                msg.channel.send('Oh no! Something went wrong :(');
                console.log(err);
            });
	},
};