module.exports = {
	name: 'ping',
	description: 'Pong!',
	execute(msg, args) {
        msg.channel.send('pong');
	},
};