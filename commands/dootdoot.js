module.exports = {
	name: 'dootdoot',
	description: 'Doots the Doot!',
	execute(msg, args) {
        msg.channel.send({files: ['https://cdn.discordapp.com/attachments/360697286545768450/691001194977427456/dootdoot.png']});
	},
};