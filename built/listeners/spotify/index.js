"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
var reactions_1 = __importDefault(require("./reactions"));
var archive_1 = __importDefault(require("./archive"));
require('dotenv').config();
var api = new spotify_web_api_node_1.default({
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: 'https://botoxic.hemanthari.com/spotifycallback'
});
exports.default = {
    description: "Listens for spotify links for spotify integration integration",
    listen: function (msg) {
        archive_1.default.passthrough(msg);
        reactions_1.default.react(msg);
        var reactionListener = msg.createReactionCollector((reactions_1.default.filter), { time: 10 * 60 * 60 * 1000 });
        reactionListener.on('collect', function (reaction, user) { return reactions_1.default.handle(reaction, user, api); });
    }
};
