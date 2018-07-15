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
        spotifyThis();
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

function spotifyThis() {
    var song = 'The Sign';
    if (process.argv.length > 3) {
        song = process.argv[3];
    }

    spotify.search( { type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

            var artists = data.tracks.items[0].artists[0].name;
            for ( var i = 1; i<data.tracks.items[0].artists; i++ ) {
                var artist =+ ', ' + data.tracks.items[0].artists[i].name;
            }
           
            console.log( 'Artists: ' + artists );
            console.log( 'Song name: ' + data.tracks.items[0].name );
            console.log( 'Album: ' + data.tracks.items[0].album.name ); 
            console.log( 'Preview link: ' + data.tracks.items[0].preview_url );

            //console.log( data.tracks.items[0] );

    });
}

function omdb() {
    var movie = 'Mr. Nobody';
    if ( process.argv.length > 3 ) {
        movie = process.argv[3];
    }

    request("http://www.omdbapi.com/?t=" + encodeURI( movie ) + "&apikey=trilogy", function(error, response, body) {
        if (!error && response.statusCode === 200) {

            console.log( 'Movie title: ' + JSON.parse( body ).Title );
            console.log( 'Year: ' + JSON.parse( body ).Year );
            console.log( 'Rated: ' + JSON.parse( body ).Rated );
            console.log( 'Language: ' + JSON.parse( body ).Language );
            console.log( 'Country: ' + JSON.parse( body ).Country );
            console.log( 'Director: ' + JSON.parse( body ).Director );
            console.log( 'Actors: ' + JSON.parse( body ).Actors );
            console.log( 'Plot: ' + JSON.parse( body ).Plot );
            console.log( JSON.parse( body ).Ratings[0].Source + ' rating: ' + JSON.parse( body ).Ratings[0].Value );
            console.log( JSON.parse( body ).Ratings[1].Source + ' rating: ' + JSON.parse( body ).Ratings[1].Value );

        }
    });
}

function dwis() {

}
