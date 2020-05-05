"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var share_1 = __importDefault(require("./share"));
var getMe_1 = __importDefault(require("./getMe"));
var link_1 = __importDefault(require("./link"));
var archive_1 = __importDefault(require("./archive"));
exports.default = {
    Link: link_1.default,
    GetMe: getMe_1.default,
    Share: share_1.default,
    Archive: archive_1.default,
};
