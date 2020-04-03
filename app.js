"use strict"
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var botoxic = require('./bot')

var app = express();

//Middleware
app.use(cors({credentials: true, origin: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Static file serving
app.use(express.static('public'));

app.get('/', entryPoint);
function entryPoint(req, res){
  console.log("here I am buddy boy");
  res.sendFile(path.join(__dirname, 'public/app.html'));
}

app.listen(8000, () => console.log('listening on port 8000'));