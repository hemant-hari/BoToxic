"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var spotify_1 = __importDefault(require("./spotify"));
var ping_1 = __importDefault(require("./ping"));
var dootdoot_1 = __importDefault(require("./dootdoot"));
exports.default = {
    Ping: ping_1.default,
    DootDoot: dootdoot_1.default,
    RedditTop: require('./reddittop'),
    APOD: require('./apod'),
    Spotify: spotify_1.default
};
