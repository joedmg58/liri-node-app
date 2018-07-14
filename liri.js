require('dotenv').config();
require('keys.js');

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

var spotify = new Spotify( keys.spotify );
var client = new Twitter( keys.twitter );
