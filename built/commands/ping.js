"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'ping',
    description: 'Pong!',
    execute: function (msg, args) {
        msg.channel.send('pong');
    },
};
