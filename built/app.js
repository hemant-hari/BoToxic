"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var createError = require('http-errors');
var express_1 = __importDefault(require("express"));
var path = require('path');
var cors = require('cors');
require('dotenv').config();
var user_1 = require("./mongo/models/user");
var spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
var mongoose_1 = require("mongoose");
var config_1 = __importDefault(require("./mongo/config"));
mongoose_1.connect(config_1.default.url, { useNewUrlParser: true });
exports.db = mongoose_1.connection;
exports.db.on('error', console.error.bind(console, 'connection error:'));
exports.db.once('open', function () {
    console.log("Connected to MongoDB Server");
});
//start the bot
var botoxic = require('./bot');
var app = express_1.default();
var clientId = process.env.SPOTIFY_ID;
var clientSecret = process.env.SPOTIFY_SECRET;
var redirectUri = "https://botoxic.hemanthari.com/spotifycallback";
var spotifyApi = new spotify_web_api_node_1.default({ clientId: clientId, clientSecret: clientSecret, redirectUri: redirectUri });
//Middleware
app.use(cors({ credentials: true, origin: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path.join(__dirname, 'public')));
// Static file serving
app.use(express_1.default.static('public'));
app.get('/', entryPoint);
function entryPoint(req, res) {
    console.log("here I am buddy boy");
    res.sendFile(path.join(__dirname, 'public/app.html'));
}
app.listen(8000, function () { return console.log('listening on port 8000'); });
app.get('/spotifycallback', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var code, state, accessGrant, stateArray, id, username, expiryNum, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = req.query.code.toString() || null;
                    state = req.query.state.toString() || null;
                    if (state === null) {
                        res.send("Authorisation could not connect to your discord user");
                    }
                    return [4 /*yield*/, spotifyApi.authorizationCodeGrant(code).catch(function (e) { return console.log(e); })];
                case 1:
                    accessGrant = _a.sent();
                    if (!accessGrant) {
                        return [2 /*return*/];
                    }
                    stateArray = state.split('_');
                    id = stateArray[0];
                    username = stateArray[1];
                    expiryNum = Date.now() + accessGrant.body.expires_in * 1000;
                    user = {
                        id: id,
                        username: username,
                        spotify: {
                            accessToken: accessGrant.body.access_token,
                            refreshToken: accessGrant.body.refresh_token,
                            expiry: expiryNum,
                        },
                    };
                    user_1.DbUser
                        .updateOne({ id: id }, user, { upsert: true, setDefaultsOnInsert: true })
                        .catch(function (e) { return console.log(e); });
                    res.sendFile(path.join(__dirname, 'public/app.html'));
                    return [2 /*return*/];
            }
        });
    });
});
