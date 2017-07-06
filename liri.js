// Write code needed to grab the data from keys.js. Then store the keys in a vairable
// Make it so liri.js can take in the commands
// my-tweets
// spotify-this-song
// movie-this
// do-what-it-says
// 
var fs = require('fs');
// var spotify = require("spotify");
var SpotifyWebApi = require("spotify-web-api-node");
var twitter = require("twitter");
var keys = require("./keys.js");
var request = require("request");
var input = process.argv;
var command = process.argv[2];
input = input.splice(3, input.length);
var searchFor = "";
for (var i = 0; i < input.length; i++) {
  searchFor += input[i] + " ";
}
searchFor.trim();

whichAPI();

function whichAPI() {
  switch (command) {
    case "my-tweets":
      myTweets();
      break;
    case "spotify-this-song":
      spotifyThis();
      break;
    case "movie-this":
      movieThis();
      break;
    case "do-what-it-says":
      doThis();
      break;
    default:
      console.log("That command was not recognized");
      break;
  }
}

// Call to Twitter API
function myTweets() {
  // console.log("Twitter search");
  var myKeys = keys.twitterKeys;

  var client = new twitter({
    consumer_key: myKeys['consumer_key'],
    consumer_secret: myKeys['consumer_secret'],
    access_token_key: myKeys['access_token_key'],
    access_token_secret: myKeys['access_token_secret'],
  });

  var params = { screen_name: 'dancwru' };
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].created_at + " " + tweets[i].text)
      }
    }
  });
}

// Call to Spotify API
function spotifyThis() {
  // console.log("Spotify This");

  if (searchFor) {
    searchFor = "track:" + searchFor;
  } else {
    searchFor = "track:The Sign artist:Ace Of Base";
    artist = "Ace of Base"
  }

  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken('BQD45CVE0mBLrCWiNLFQ5HZMzP2kTx8kpFs3aTjJeGAQS0OU62p7qnWdV_ylMOJZaXVsmfsVux-VrbTLgKURHdXlBz7-fEFhls0RSkRbvQAOasnkTgJCHOp3hkOVNsdB18I1vKxXdsmz2Uy4pJ-wZz7eLtetB9ESIBY');
  spotifyApi.searchTracks(searchFor, { limit: 1, offset: 1 })
    .then(function(data) {
      // console.log('Search tracks by "Love" in the artist name', JSON.stringify(data.body.tracks.items["album"],null, 2));
      console.log(data.body.tracks.items[0]['name']);
      console.log(data.body.tracks.items[0]['preview_url']);
      console.log(data.body.tracks.items[0]['album']['artists'][0]['name']);
      console.log(data.body.tracks.items[0]['album']['name']);
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

// Call to OMDB API
function movieThis() {
  // console.log("OMDB Search");
  var queryUrl = "http://www.omdbapi.com/?apiKey=40e9cece&t="
  var movieTitle = "";

  if (searchFor) {
    movieTitle = searchFor;
  } else {
    movieTitle = "Mr. Nobody";
  }

  request(queryUrl + movieTitle, function(err, response, body) {
    if (!err) {
      if (response.statusCode === 200) {
        var movie = JSON.parse(body);
        // console.log(JSON.stringify(body,null,2));
        console.log("Title: " + movie.Title);
        console.log("Year: " + movie.Year);
        console.log("Country: " + movie.Country);
        console.log("Language: " + movie.Language);
        console.log("Plot: " + movie.Plot);
        console.log("Actors: " + movie.Actors);
        console.log("IMDB Rating: " + movie.Ratings[0]["Value"]);
        console.log("Rotten Rating: " + movie.Ratings[1]["Value"]);
      } else {
        console.log(response.statusCode);
      }
    } else {
      console.log("Request failed");
    }
  });
}

// Read from Random.txt
function doThis() {
  // console.log("Do this");
  var filePath = process.cwd() + "\\random.txt";
  var data = fs.readFile(filePath, 'utf-8', function(err, data) {
    if (!err) {
      data = data.split(",");
      command = data[0];
      searchFor = data[1];
      whichAPI();
    } else {
      console.log(err);
    }
  });
}
