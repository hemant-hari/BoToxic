"use strict"
var createError = require('http-errors');
var SpotifyWebApi = require('spotify-web-api-node');
var express = require('express');
var path = require('path');
var cors = require('cors');
require('dotenv').config();

var mongoose = require('./mongo');
var User = require('./mongo/models/user');

//start the bot
var botoxic = require('./bot');

var app = express();

const clientId = process.env.SPOTIFY_ID;
const clientSecret = process.env.SPOTIFY_SECRET;
const redirectUri = "https://botoxic.hemanthari.com/spotifycallback";

var spotifyApi = new SpotifyWebApi({ clientId, clientSecret, redirectUri });


//Middleware
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Static file serving
app.use(express.static('public'));

app.get('/', entryPoint);
function entryPoint(req, res) {
  console.log("here I am buddy boy");
  res.sendFile(path.join(__dirname, 'public/app.html'));
}

app.listen(8000, () => console.log('listening on port 8000'));

app.get('/spotifycallback', async function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  if (state === null) {
    res.send("Authorisation could not connect to your discord user");
  }

  var accessGrant = await spotifyApi.authorizationCodeGrant(code).catch(e => console.log(e));
  if (!accessGrant) { return; }

  state = state.split('_');
  var id = state[0];
  var username = state[1];

  var user = new User({
    id,
    username,
    spotify: {
      accessToken: accessGrant.body.access_token,
      refreshToken: accessGrant.body.refresh_token,
      expiry: accessGrant.body.expires_in,
    },
  });

  user.save((err, user) => {
    if (err) { console.log(err); }
    console.log(user);
  });

  spotifyApi.setAccessToken(accessGrant.body.access_token);
  spotifyApi.setRefreshToken(accessGrant.body.refresh_token);

  var userData = await spotifyApi.getMe().catch(e => console.log(e));
  console.log(userData);

  res.sendFile(path.join(__dirname, 'public/app.html'));
});