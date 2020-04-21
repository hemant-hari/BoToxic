import { Message } from "discord.js";

export default {
	name: 'ping',
	description: 'Pong!',
	execute(msg: Message, args: string[]) {
		msg.channel.send('pong');
	},
};