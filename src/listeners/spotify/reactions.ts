import { MessageReaction, User, Message } from "discord.js";
import SpotifyWebApi from "spotify-web-api-node";
import enqueue from './enqueue';
import skipto from './skipto';

export default {
    dict: {
        '⏯️': enqueue,
        '⏭️': skipto,
    },
    filter: function (reaction: MessageReaction, user: User) {
        var listen = true;
        if (user.bot) { return false; }
        for (var emoji in this.dict) {
            listen = listen && reaction.emoji.name === emoji;
        }
        return listen;
    },
    react: function (msg: Message) {
        for (var emoji in this.dict) {
            msg.react(emoji);
        }
    },
    handle: function (reaction: MessageReaction, user: User, api: SpotifyWebApi) {
        this.dict[reaction.emoji.name].execute(reaction, user, api);
    }
}