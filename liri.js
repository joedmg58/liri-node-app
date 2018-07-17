//Loading modules needed, and initializing some variables
require('dotenv').config();
var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var spotify = new Spotify( keys.spotify );
var client = new Twitter( keys.twitter );



function execCmd( cmd, prm ) {
    switch (cmd) {
        case 'my-tweets': 
            tweeter( 'joeUM58' );
            break;
        case 'tweets-of':
            var userId = 'joeUM58';
            if (process.argv.length > 3) {
                userId = process.argv[3];
            }
            tweeter( userId );
            break;            
        case 'spotify-this-song':
            spotifyThis( prm );
            break;
        case 'movie-this':
            omdb( prm );
            break;
        case 'do-what-it-says':
            dwis();
            break;
        case '-help':
            help();
            break;    
        default:
            return console.log('Bad or missing command. Try -help for HELP'); //print this message in case of bad or missing command
    }
}    

function logToFile( txt ) {
    var now = new Date();
    var loginfo = now.toLocaleString() + ' - ' + txt;
    fs.appendFile( 'history.log', loginfo, function( error ) {
        if ( error ) {
            console.log( error );
        }
    } );
}


function help() {
    console.log( 'Liri Bot 0.1 - UM Codding Boot Camp, Nodejs homework. Joed Machado, 2018.');
    console.log( '--------------------------------------------------------------------------------' );
    console.log( 'The allowed commands are: ' );
    console.log( '  liri my-tweets - It will show you my tweets message.' );
    console.log( '  liri tweets-of <user_id> - Shows the tweeters of some user.' );
    console.log( '  liri spotify-this-song <song_name> - It will bring some info about the song using spotify API.' );
    console.log( '  liri movie-this <movie_name> - shows info about the movie using omdb API.' );
    console.log( '  liti do-what-it-says - It will run the batch command on random.txt.');
    console.log( '--------------------------------------------------------------------------------' );

}


function tweeter( userId ) {
    console.log('Showing your tweets: ');
    console.log('--------------------------------------------------------------------------------');
    var params = {screen_name: userId }; //joeUM58
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
    var song = 'The Sign'; //in case of no argument the default song is this
    if (process.argv.length > 3) {
        song = process.argv[3];
    }

    spotify.search( { type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

            if ( data != null ) {
                var artists = data.tracks.items[0].artists[0].name;
                for ( var i = 1; i<data.tracks.items[0].artists; i++ ) {
                    var artist =+ ', ' + data.tracks.items[0].artists[i].name;
                }
            
                console.log( 'Artists: ' + artists );
                console.log( 'Song name: ' + data.tracks.items[0].name );
                console.log( 'Album: ' + data.tracks.items[0].album.name ); 
                console.log( 'Preview link: ' + data.tracks.items[0].preview_url );
                console.log( '--------------------------------------------------------------------------------' );

                //console.log( data.tracks.items[0] );
            }
            else { console.log( 'Sorry, no info for this song can be found.' ); }                

    });
}

function omdb() {
    var movie = 'Mr. Nobody';
    if ( process.argv.length > 3 ) { //in case no argument for movie has typed we choose 'Mr. Nobody by default'
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
            for ( var i = 0; i < JSON.parse( body ).Ratings.length; i++ ) {
                console.log( JSON.parse( body ).Ratings[i].Source + ' rating: ' + JSON.parse( body ).Ratings[i].Value );
            }    
            console.log( '--------------------------------------------------------------------------------' );

        }
    });
}

function dwis() {
    fs.readFile( "random.txt", "utf8", function(error, data) {
        if ( error ) {
            return console.log( error );
        }

        var dataArr = data.split(',');

        execCmd( dataArr[0], dataArr[1] );
    } );
}

//main start here ----------------------------------------------------------

//Grab parameter input
var cmd = '';
if (process.argv.length > 2) {
    cmd = process.argv[2].toLowerCase();
}

var str = 'node liri.js ';
for ( var i = 2; i<process.argv.length; i++) {
    if ( i === 3 ) { 
        str += '"' + process.argv[i] + '"'; 
    }
    else { 
        str += process.argv[i]+' '; 
    }
}
str += '\n';
logToFile( str );

execCmd( cmd );