require("dotenv").config();
var moment = require('moment');
var fs = require("fs");
var axios = require("axios");
var keys = require("./keys");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var nodeArgs = process.argv[3];
var program = process.argv[2];

switch (program) {

    case "concert-this":
    concert(nodeArgs);
    break;

    case "spotify-this-song":
    mySpotify(nodeArgs);
    break;


	case "movie-this":
	movies(nodeArgs);
	break;

};

function concert(nodeArgs) {
    // Create an empty variable for holding the movie name
    var artist = nodeArgs;
    // // Loop through all the words in the node argument
    // // And do a little for-loop magic to handle the inclusion of "+"s
    // for (var i = 2; i < nodeArgs.length; i++) {
    //     if (i > 2 && i < nodeArgs.length) {
    //         artist = artist + "+" + nodeArgs[i];
    //     }
    //     else {
    //         artist += nodeArgs[i];
    //     }
    // }
    // Then run a request with axios to the OMDB API with the movie specified
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id="+ keys.concert.id;
    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);
    axios.get(queryUrl).then(
        function (response) {
            // console.log(response.data[0])
            // console.log("Venue Time: "+moment(response.data[0].datetime, 'YYYY-MM-DDTHH:mm:ss').format('MM/DD/YYYY, h:mm A'));
            for (var i = 0; i < 10; i++) {
                console.log("Venue Name: " + response.data[i].venue.name);
                console.log("Venue Location: " + response.data[i].venue.city+", "+response.data[i].venue.region + ", " + response.data[i].venue.country);
                console.log("Venue Time: "+moment(response.data[0].datetime, 'YYYY-MM-DDTHH:mm:ss').format('MM/DD/YYYY, h:mm A'));
                console.log('--------------------------------------------------')
            }
        }
    );

};

function mySpotify(nodeArgs){
    if (!nodeArgs){
        	nodeArgs = 'The Sign';
    	}
		spotify.search({ type: 'track', query: nodeArgs }, function(err, data) {
			if (err){
	            console.log('Error occurred: ' + err);
	            return;
	        }

	        var songInfo = data.tracks.items;
	        console.log("Artist(s): " + songInfo[0].artists[0].name);
	        console.log("Song Name: " + songInfo[0].name);
	        console.log("Preview Link: " + songInfo[0].preview_url);
	        console.log("Album: " + songInfo[0].album.name);
	});
}



function movies(nodeArgs) {
    if (!nodeArgs){
        	nodeArgs = 'Mr Nobody';
    	}
    // Then run a request with axios to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey="+ keys.omdb.id;
    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);
    axios.get(queryUrl).then(
        function (response) {
            console.log("Release Year: " + response.data.Year);
            if (!error && response.statusCode === 200) {
                var jsonData = JSON.parse(body);
                console.log("Title: " + jsonData.Title);
                console.log("Year: " + jsonData.Year);
                console.log("IMDB Rating: " + jsonData.imdbRating);
                console.log("Rotton Tomatoes Rating: " + jsonData.Ratings[1].Value);
                console.log("Country: " + jsonData.Country);
                console.log("Language: " + jsonData.Language);
                console.log("Plot: " + jsonData.Plot);
                console.log("Actors: " + jsonData.Actors);
            }
        }
    );

};