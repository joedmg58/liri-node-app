//Loading modules needed, and initializing some variables
require('dotenv').config();
var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

var spotify = new Spotify( keys.spotify );
var client = new Twitter( keys.twitter );

//Grab parameter input
var cmd = '';
if (process.argv.length > 2) {
    cmd = process.argv[2].toLowerCase();
}

switch (cmd) {
    case 'my-tweets': 
        tweeter();
        break;
    case 'spotify-this-song':
        spotify();
        break;
    case 'movie-this':
        omdb();
        break;
    case 'do-what-it-says':
        dwis();
        break;
    default:
        console.log('bad or missing command'); //print this message in case of bad or missing command
}

function tweeter() {
    console.log('Showing your tweets: ');
    console.log('--------------------------------------------------------------------------------');
    var params = {screen_name: 'joeUM58'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            //console.log(tweets);
            for (var i=0; i<tweets.length; i++) {
                console.log( tweets[i].created_at );
                console.log( tweets[i].text );
                console.log( '--------------------------------------------------------------------------------' );
            }
        }
    });
}

function spotify() {
    if (process.argv.length > 3) {
        var song = process.argv[3];
        console.log('Spotifying ', song);
    }
    else {
        console.log('enter a song name');
    }
}

function omdb() {

}

function dwis() {

}
