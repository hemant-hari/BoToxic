"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var flags_1 = __importDefault(require("./flags"));
exports.default = {
    passthrough: function (msg) {
        for (var key in flags_1.default) {
            if (msg.content.includes(key)) {
                flags_1.default[key].listen(msg);
            }
        }
    }
};
