"use strict"
var createError = require('http-errors');
import express from 'express';
var path = require('path');
var cors = require('cors');
require('dotenv').config();

import { DbUser } from './mongo/models/user'
import SpotifyWebApi from 'spotify-web-api-node';
import { connect, connection } from 'mongoose';
import config from './mongo/config';

connect(config.url, { useNewUrlParser: true });

export var db = connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected to MongoDB Server")
});

//start the bot
var botoxic = require('./bot');

var app = express();

const clientId = process.env.SPOTIFY_ID;
const clientSecret = process.env.SPOTIFY_SECRET;
const redirectUri = "https://botoxic.hemanthari.com/spotifycallback";

var spotifyApi: SpotifyWebApi = new SpotifyWebApi({ clientId, clientSecret, redirectUri });


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
  var code: string = req.query.code.toString() || null;
  var state: string = req.query.state.toString() || null;
  if (state === null) {
    res.send("Authorisation could not connect to your discord user");
  }

  var accessGrant = await spotifyApi.authorizationCodeGrant(code).catch(e => console.log(e));
  if (!accessGrant) { return; }

  var stateArray: string[] = state.split('_');
  var id = stateArray[0];
  var username = stateArray[1];
  var expiryNum: number = Date.now() + accessGrant.body.expires_in * 1000;

  var user = {
    id,
    username,
    spotify: {
      accessToken: accessGrant.body.access_token,
      refreshToken: accessGrant.body.refresh_token,
      expiry: expiryNum,
    },
  };

  DbUser
    .updateOne(
      { id },
      user,
      { upsert: true, setDefaultsOnInsert: true })
    .catch(
      e => console.log(e)
    );

  res.sendFile(path.join(__dirname, 'public/app.html'));
});