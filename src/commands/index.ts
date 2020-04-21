import spotify from "./spotify";
import ping from './ping';
import dootdoot from './dootdoot';

export default {
    Ping: ping,
    DootDoot: dootdoot,
    RedditTop: require('./reddittop'),
    APOD: require('./apod'),
    Spotify: spotify
};