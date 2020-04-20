import { Message } from "discord.js";
import flags from './flags';

export default {
    passthrough: function (msg: Message) {
        for (var key in flags) {
            if (msg.content.includes(key)) {
                flags[key].listen(msg);
            }
        }
    }
}