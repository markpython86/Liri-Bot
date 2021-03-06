//grab data from dotenv file
require("dotenv").config();

//Require data from moment npm package
let moment = require('moment');
//Require data from File System npm package
let fs = require("fs");
//Require data from Axios npm package
let axios = require("axios");
//Grab data key from keys.js file
let keys = require("./keys");
//Require data from node-API npm package
let Spotify = require('node-spotify-api');
//Store spotify API key 
let spotify = new Spotify(keys.spotify);
//Store the second argument from the command line
let nodeArgs = process.argv.slice(3).join("+")//process.argv[3];
//store the 1st argument to the end from the comman line
let command = process.argv.slice(2).join(" ");
//Store the first argument from the command line
let program = process.argv[2];
//adding this message

//Program conditions 
switch (program) {
    // help function to clarify commands used
    case "help":
        console.log("Please type one of these commands\n"+
                    " *concert-this': to search your favorite artist concerts\n"+
                    " *spotify-this-song': to search your favorite song\n"+
                    " *movie-this': to search your favorite movie \n"+
                    " *do-what-it-says': using command from random.txt \n"
                    );
        break;
    case "concert-this":
        myConcert(nodeArgs);
        break;
    case "spotify-this-song":
        mySpotify(nodeArgs);
        break;
    case "movie-this":
        myMovies(nodeArgs);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    //if anything else written
    default:
        console.log("LIRI doesn't understand that - Please type 'node liri.js help' for more information");
};

//Concert function
function myConcert(nodeArgs) {
    var artist = nodeArgs;
    let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id="+ keys.concert.id;
    // console.log(queryUrl);
    axios.get(queryUrl).then(function (response) {
        // console.log(response.data[0])
        // console.log("Venue Time: "+moment(response.data[0].datetime, 'YYYY-MM-DDTHH:mm:ss').format('MM/DD/YYYY, h:mm A'));
        if (response.data == 0) {
            var retreivingOriginalData = artist.split('+').join(' ')
            console.log("We couldnt find concerts for " + retreivingOriginalData + "; Please change the Band name and search again")
        } else {
            for (var i = 0; i < 5; i++) {
                console.log("Venue Name: " + response.data[i].venue.name);
                console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
                console.log("Venue Time: " + moment(response.data[0].datetime, 'YYYY-MM-DDTHH:mm:ss').format('MM/DD/YYYY, h:mm A'));
                console.log('--------------------------------------------------')
                //adds output to log.txt
                fs.appendFileSync('log.txt', "\r\n" + "Concert Search Log-------------------------------------------------" + "\r\n");
                fs.appendFileSync('log.txt', "\r\n" + "Command used: node liri.js " + command + "\r\n");
                fs.appendFileSync('log.txt', "\r\n" + "Venue Name: " + response.data[i].venue.name + "\r\n");
                fs.appendFileSync('log.txt', "\r\n" + "Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country + "\r\n");
                fs.appendFileSync('log.txt', "\r\n" + "Venue Time: " + moment(response.data[0].datetime, 'YYYY-MM-DDTHH:mm:ss').format('MM/DD/YYYY, h:mm A') + "\r\n");
                fs.appendFileSync('log.txt', "\r\n" + "----------------------------------------------------------------" + "\r\n");
            }
        }
    });
};


// Search fav song function 
function mySpotify(nodeArgs){
    //if there are no arguments transfer the user to a default search
    if (!nodeArgs){
        	nodeArgs = 'the+sign';
    	}
        // var song = process.argv.slice(3).join("+");
		spotify.search({ type: 'track', query: nodeArgs, limit: 4 }, function(err, data) {
			if (err){
	            console.log('Error occurred: ' + err);
	            return;
	        }
	        let songData = data.tracks.items;
	        console.log("Artist(s): " + songData[0].artists[0].name);
	        console.log("Song Name: " + songData[0].name);
	        console.log("Preview Link: " + songData[0].preview_url);
	        console.log("Album: " + songData[0].album.name);
            //adds output to log.txt
            fs.appendFileSync('log.txt', "\r\n" + "Song Search Log-------------------------------------------------"+ "\r\n", 'utf8');
            fs.appendFileSync('log.txt', "\r\n" + "Command used: node liri.js " + command + "\r\n");
            fs.appendFileSync('log.txt', "\r\n" + "Artist(s): " + songData[0].artists[0].name + "\r\n", 'utf8');
            fs.appendFileSync('log.txt', "\r\n" + "Song Name: " + songData[0].name + "\r\n", 'utf8' );
            fs.appendFileSync('log.txt', "\r\n" + "Preview Link: " + songData[0].preview_url+ "\r\n", 'utf8' );
            fs.appendFileSync('log.txt', "\r\n" + "Album: " + songData[0].album.name+ "\r\n", 'utf8');
            fs.appendFileSync('log.txt', "\r\n" + "----------------------------------------------------------------"+ "\r\n", 'utf8');
    });
}


//search movies function
function myMovies(nodeArgs, command) {
    let movieName = nodeArgs;
    //if there are no arguments transfer the user to a default search
    if (!nodeArgs){
        	movieName = 'Mr Nobody';
    	}
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + keys.omdb.id;
    
    // This line is just to help us debug against the actual URL.
    // console.log(queryUrl);
    axios.get(queryUrl).then(
        function (response) {
            // if (response.statusCode === 200) {
                var jsonData = response.data;
                console.log("Title: " + jsonData.Title);
                console.log("Release Year: " + jsonData.Year);
                console.log("IMDB Rating: " + jsonData.imdbRating);
                console.log("Rotton Tomatoes Rating: " + jsonData.Ratings[1].Value);
                console.log("Country: " + jsonData.Country);
                console.log("Language: " + jsonData.Language);
                console.log("Plot: " + jsonData.Plot);
                console.log("Actors: " + jsonData.Actors);
                // console.log(""+command)
                //adds text to log.txt
                fs.appendFileSync('log.txt', "\r\n" + "Movie Search Log-----------------------" + "\r\n");
                fs.appendFileSync('log.txt', "\r\n" + "Command used: node liri.js " + command + "\r\n");
                fs.appendFileSync('log.txt', "\r\n" + "Title: " + jsonData.Title + "\r\n");
                fs.appendFileSync('log.txt', "\r\n" + "Release Year: " + jsonData.Year + "\r\n");
                fs.appendFileSync('log.txt', "\r\n" + "IMDB Rating: " + jsonData.imdbRating + "\r\n");
                fs.appendFileSync('log.txt', "\r\n" + "Rotten Tomatoes URL: " + jsonData.tomatoURL + "\r\n");
                fs.appendFileSync('log.txt', "\r\n" + "Country: " + jsonData.Country + "\r\n");
                fs.appendFileSync('log.txt', "\r\n" + "Language: " + jsonData.Language + "\r\n");
                fs.appendFileSync('log.txt', "\r\n" + "Plot: " + jsonData.Plot + "\r\n");
                fs.appendFileSync('log.txt', "\r\n" + "Actors: " + jsonData.Actors + "\r\n");
                fs.appendFileSync('log.txt', "\r\n" + "---------------------------------------" + "\r\n");

            // }
        }
    );

};


//Do what it says function
function doWhatItSays() {
	fs.readFile('random.txt', "utf8", function(error, data){

		if (error) {
    		return console.log(error);
  		}

		// Then split it by commas (to make it more readable)
		let dataArr = data.split(",");

		// Each command is represented. Because of the format in the txt file, remove the quotes to run these commands. 
		if (dataArr[0] === "spotify-this-song") {
			let songcheck = dataArr[1].slice(1, -1);
            console.log("songCheck: "+songcheck)
			mySpotify(songcheck);
		} else if (dataArr[0] === "concert-this") {
			let venueName = dataArr[1].slice(1, -1);
            console.log("venueName: "+venueName)
			myConcert(venueName);
		} else if(dataArr[0] === "movie-this") {
			let movieName = dataArr[1].slice(1, -1);
            console.log("movieName: "+movieName)
			myMovies(movieName);
		} 
		
  	});

};

