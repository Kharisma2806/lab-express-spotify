require('dotenv').config();
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

    // Our routes go here:

app.get("/", (req, res, next) =>  {
    res.render("index");
});

app.get("/artist-search", (req, res, next) => {
    console.log('DEBUGGING')
    spotifyApi
        .searchArtists(req.query.artist)
        .then((artistsArr) => {
console.log(artistsArr);
            const data = {
                artists: artistsArr.body.artists.items
            }

            res.render('artist-search-results', data);

        })
        .catch(err => console.log('An error while searching artists occurred: ', err));
        });

app.get('/albums/:artistId', (req, res, next) => {

    artistId = req.params.artistId;

    spotifyApi
        .getArtistAlbums(artistId)
        .then(albumData => {
    
            res.render('albums', {albumData});
        })
        .catch(err => console.log('An error occurred while getting album data', err));
})

app.get('/tracks/:albumId', (req, res, next) => {

    albumId = req.params.albumId;

    spotifyApi
        .getAlbumTracks(albumId)
        .then(tracksData => {
            res.render('tracks', {tracksData})
        })
        .catch(err => console.log('An error occurred while getting album tracks', err));
})

app.listen(3003, () => console.log('My Spotify project running on port 3003 🎧 🥁 🎸 🔊'));
