import { Message } from "discord.js";

export default {
	name: 'dootdoot',
	description: 'Doots the Doot!',
	execute(msg: Message, args: string[]) {
		msg.channel.send({ files: ['https://cdn.discordapp.com/attachments/360697286545768450/691001194977427456/dootdoot.png'] });
	},
};