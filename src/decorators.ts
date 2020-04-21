import { User, TextChannel, DMChannel, NewsChannel } from "discord.js";
import { DbUser, updateAccessToken } from "./mongo/models/user";
import SpotifyWebApi from "spotify-web-api-node";

export async function autoRefresh<T>
    (
        api: SpotifyWebApi,
        call: () => Promise<T>,
        user: User,
        channel: TextChannel | DMChannel | NewsChannel
    ): Promise<T | void> {
    var dbUser: any
        = await DbUser.findOne({ id: user.id })
            .catch(e => {
                channel.send("Something went wrong retrieving your spotify data, have you linked your account?")
            });

    try {
        api.setAccessToken(dbUser.spotify.accessToken);
        api.setRefreshToken(dbUser.spotify.refreshToken);

        if (Date.now() > dbUser.spotify.expiry) {
            try {
                var refresh = await api.refreshAccessToken();
                api.setAccessToken(refresh.body['access_token']);
                updateAccessToken(dbUser.id, refresh.body['access_token']);
            }
            catch (e) {
                console.log(e);
                channel.send("Something went wrong re-authenticating with spotify - maybe try using the link command again")
            }
        }

        var response = call()
            .catch(e => {
                console.log(e);
                channel.send("Something went wrong!");
            });
        api.resetAccessToken();
        api.resetRefreshToken();

        return response;
    } catch (e) {
        console.log(e);
        channel.send("Oh no, something went wrong dealing with spotify!");
    }
}