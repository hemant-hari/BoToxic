"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var enqueue_1 = __importDefault(require("./enqueue"));
var skipto_1 = __importDefault(require("./skipto"));
exports.default = {
    dict: {
        '⏯️': enqueue_1.default,
        '⏭️': skipto_1.default,
    },
    filter: function (reaction, user) {
        var listen = true;
        if (user.bot) {
            return false;
        }
        for (var emoji in this.dict) {
            listen = listen && reaction.emoji.name === emoji;
        }
        return listen;
    },
    react: function (msg) {
        for (var emoji in this.dict) {
            msg.react(emoji);
        }
    },
    handle: function (reaction, user, api) {
        this.dict[reaction.emoji.name].execute(reaction, user, api);
    }
};
