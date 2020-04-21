"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var spotify_1 = __importDefault(require("./spotify"));
var ping_1 = __importDefault(require("./ping"));
var dootdoot_1 = __importDefault(require("./dootdoot"));
var reddittop_1 = __importDefault(require("./reddittop"));
var apod_1 = __importDefault(require("./apod"));
exports.default = {
    Ping: ping_1.default,
    DootDoot: dootdoot_1.default,
    RedditTop: reddittop_1.default,
    APOD: apod_1.default,
    Spotify: spotify_1.default,
};
