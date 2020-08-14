//This is where all the calls will be made and etc.
//Sorting algorithms will also go here

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const fetch = require('node-fetch');
//relative path
const Pokemon = require('./pokemon.js');
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
let nationalPokedex = new Array(2);
console.log(nationalPokedex.length);

//This function takes the data and makes an array of the pokemon
async function generatePokedex() {
  let i;
  for (i = 0; i < nationalPokedex.length; i++) {
    let pokeID = i + 1; //to get pokemon to show up in order make this function async, and put await in front of this line
    const data1 = await initPokeData1(pokeID);
    const data2 = await initPokeData2(pokeID);
    console.log(data1);
    console.log(data2);


  }
}

//function which calls to pokeapi and gets the first portion of data required
async function initPokeData1(pokemonID) {
  try {
    const pokemon = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonID}/`
    );
    const pokeData = await pokemon.json();

    let id = pokeData.id;
    let name = pokeData.name;
    let genus = pokeData.genera[7].genus;
    let entry;

    //entries vary between games
    if (id <= 151)
      //Platinum-gen1
      entry = pokeData.flavor_text_entries[13].flavor_text;
    else if (id >= 152 || id <= 251)
      //Platinum-gen2
      entry = pokeData.flavor_text_entries[10].flavor_text;
    else if (id >= 252 || id <= 386)
      //Emerald-gen3
      entry = pokeData.flavor_text_entries[2].flavor_text;
    else if (id >= 387 || id <= 493)
      //Platinum-gen4
      entry = pokeData.flavor_text_entries[2].flavor_text;
    else if (id >= 494 || id <= 649)
      //BW2-gen5
      entry = pokeData.flavor_text_entries[5].flavor_text;
    else if (id >= 650 || id <= 721)
      //Y-gen6
      entry = pokeData.flavor_text_entries[14].flavor_text;
    else if (id >= 722 || id <= 802)
      //USUM-gen7
      entry = pokeData.flavor_text_entries[17].flavor_text;
    else if (id >= 803 || id <= 807)
      //USUM-gen7
      entry = pokeData.flavor_text_entries[7].flavor_text;

    let dataSet1 = {
      id,
      name,
      genus,
      entry
    };
    return dataSet1;
  } catch (err) {
    console.log(err);
  }
}

//gets the second half of pokemon data required weight,height,type,sprite
async function initPokeData2(pokemonID) {
  try {
    const pokemon = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonID}/`
    );

    const pokeData = await pokemon.json();
    let weight = pokeData.weight;
    let height = pokeData.height;
    let type = pokeData.types;
    let sprite = pokeData.sprites.front_default;
    let dataSet2 = {
      weight,
      height,
      type,
      sprite
    };
    return dataSet2;

  } catch (err) {
    console.log(err);
  }
}

//Creates single pokemon objects to be sent back
function createPokemonObj(pokemonData) {
  //Destructuring
  const {
    id,
    name,
    weight,
    height,
    type,
    sprite,
    genus,
    entry
  } = pokemonData;
  let newPokemon = new Pokemon(
    id,
    name,
    weight,
    height,
    type,
    sprite,
    genus,
    entry
  );
  //console.log(newPokemon); //I have to import the class...
}

generatePokedex();

app.listen(3000, () => {
  console.log('Server started on port 3000');
}); //Server is tuning into the channel 3000