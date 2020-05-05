import { Message } from "discord.js";
import { getArchiveConfig } from "../../mongo/models/guildconfig";

const botId = "691285973274722305";

export default {
    passthrough: async function (msg: Message) {
        let config = (await getArchiveConfig(msg.guild.id)).spotify;
        if (config.archive
            && msg.author.id == botId
            && msg.channel.id != config.archiveChannel) {
            msg.delete({ timeout: config.expiry * 1000 });
        }
    }
}