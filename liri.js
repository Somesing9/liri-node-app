// Write code needed to grab the data from keys.js. Then store the keys in a vairable
// Make it so liri.js can take in the commands
// my-tweets
// spotify-this-song
// movie-this
// do-what-it-says
// 
var fs = require('fs');
var spotify = require("spotify");
var twitter = require("twitter");
var client = new twitter({
  consumer_key: '6H1OODihqYLo19Iso21iAaku9',
  consumer_secret: 'MMCibOPqrtm3ONn8KZLmZySB1SCJOlQkI6nMY7TK58SPaRoZW5',
  access_token_key: '879852472126369794-fOAuE2oFv2Z2xdjbN6SgJNyyjIwZd3Q',
  access_token_secret: 'nE0S4FdijBmtvxxjX3dYOfX5MkaQ7Lor2k6PGeyPsPd0W',
});
var request = require("request");
var input = process.argv;
var command = process.argv[2];
input = input.splice(3, input.length);
var searchFor = "";
for (var i = 0; i < input.length; i++) {
  searchFor += input[i] + " ";
}

searchFor.trim();

// console.log(command);
console.log(searchFor);
// console.log(input.length);


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

function myTweets() {
  console.log("Twitter search");

  var params = { screen_name: 'dancwru' };
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].created_at + " " + tweets[i].text)
      }
    }
  });
  // Show last 20 tweets and when they were created
}

function spotifyThis() {
  console.log("Spotify This");
  //Output
  //Artist
  //song name
  //preview link
  //albumb
  //defualt to The SIgn by Ace of Base
  spotify.search({ type: 'track', query: 'dancing in the moonlight' }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }
    console.log(JSON.stringify(data,null, 2));
    // Do something with 'data' 
  });
}

/**
 * OMDB API call
 */
function movieThis() {
  console.log("OMDB Search");
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

function doThis() {
  console.log("Do this");
  var filePath =  process.cwd() + "\\random.txt";
  var data = fs.readFile(filePath, 'utf-8', function(err, data) {
    if (!err) {
      console.log(data);
    }
    else  {
      console.log(err);
    }
  });
}
