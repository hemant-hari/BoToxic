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
var User = require('../../mongo/models/user');
var updateDbToken = require('../../mongo/models/user').updateAccessToken;
var WebApiRequest = require('../../../node_modules/spotify-web-api-node/src/webapi-request');
var HttpManager = require('../../../node_modules/spotify-web-api-node/src/http-manager');
function getURI(message) {
    var url = getURL(message);
    var uri = url.split('https://open.spotify.com/track/')[1].split('?')[0];
    return "spotify:track:" + uri;
}
;
function getURL(message) {
    var spotifyRegex = /https?:\/\/open\.spotify\.com\/track\/\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    return message.content.match(spotifyRegex)[0];
}
;
module.exports = {
    description: "Enqueues a song to the user's spotify account",
    execute: function (reaction, user, api) {
        var user;
        return __awaiter(this, void 0, void 0, function () {
            var _a, response, refresh, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, User.findOne({ id: user.id })];
                    case 1:
                        user = _b.sent();
                        api.setAccessToken(user.spotify.accessToken);
                        api.setRefreshToken(user.spotify.refreshToken);
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        reaction.message.channel.send("Something went wrong retrieving your spotify data, have you linked your account?");
                        return [2 /*return*/];
                    case 3:
                        _b.trys.push([3, 7, , 8]);
                        return [4 /*yield*/, enqueueTrack(reaction, user.spotify.accessToken).catch(function (e) { return response = e; })];
                    case 4:
                        response = _b.sent();
                        if (!(response.statusCode == 401)) return [3 /*break*/, 6];
                        return [4 /*yield*/, api.refreshAccessToken().catch(function (e) { return refresh = e; })];
                    case 5:
                        refresh = _b.sent();
                        if (refresh.name === 'WebapiError') {
                            reaction.message.channel.send("Could not authenticate - please relink your account");
                        }
                        api.setAccessToken(refresh.body['access_token']);
                        updateDbToken(user.id, refresh.body['access_token']);
                        response = enqueueTrack(reaction, user.spotify.accessToken).catch(function (e) { return console.log(e); });
                        _b.label = 6;
                    case 6:
                        api.resetAccessToken();
                        api.resetRefreshToken();
                        return [3 /*break*/, 8];
                    case 7:
                        e_1 = _b.sent();
                        console.log(e_1);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
};
function enqueueTrack(reaction, accessToken) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (WebApiRequest.builder(accessToken)
                    .withPath('/v1/me/player/queue')
                    .withHeaders({ 'Content-Type': 'application/json' })
                    .withQueryParameters({
                    uri: getURI(reaction.message)
                })
                    .build()
                    .execute(HttpManager.post, null))];
        });
    });
}
