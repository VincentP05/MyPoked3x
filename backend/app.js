//This is where all the calls will be made and etc.
//Sorting algorithms will also go here

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const fetch = require('node-fetch');

let Pokedex = require('pokedex-promise-v2');
let p = new Pokedex();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//This loads up all the html and css files in frontend
app.use(express.static(__dirname + '/frontend'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  //When mainpage is loaded, index.html is shown to browser
});

//Gets back the name of the pokemon the user searched
app.post('/', (req, res) => {
  console.log(req.body.pokemon);
});

//An Array of all 807 Pokemon, starting with bulbasaur to zeraora
let nationalPokedex = new Array(1);
console.log(nationalPokedex.length);

let i;
for (i = 0; i < nationalPokedex.length; i++) {
  let pokeID = i + 1;
  getPokeData(pokeID);
}

//function doing all the calls to pokeapi
async function getPokeData(pokemonID) {
  const pokemon = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemonID}/`
  );
  const pokeData = await pokemon.json();
  return pokeData;
}
// p.getPokemonByName('garchomp')
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log('There was an error: ', err);
//   });

// p.getPokemonSpeciesByName('turtwig')
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log('There was an ERROR: ', error);
//   });

//This is exactly what I needed

app.listen(3000, () => {
  console.log('Server started on port 3000');
}); //Server is tuning into the channel 3000
