//This is where all the calls will be made and etc.
//Sorting algorithms will also go here

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const fetch = require('node-fetch');
//relative path
const Pokemon = require('./pokemon.js');

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
let nationalPokedex = new Array(40);
console.log(nationalPokedex.length);

//This function takes the data and makes an array of the pokemon
//async always returns a promise, also allows for the use of await
async function generatePokedex() {
  let i;
  for (i = 0; i < nationalPokedex.length; i++) {
    let pokeID = i + 1; //to get pokemon to show up in order make this function async, and put await in front of this line
    const data1 = initPokeData1(pokeID);
    const data2 = initPokeData2(pokeID);
    //line below halves the time, instead of having to await data1 and data2 individually, they run asynchronously
    const finalData = await Promise.all([data1, data2]); // id,name,genus,entry,weight,height,type,sprite
    //finalData is a array of arrays data1 and data2
    //we want the parameters to be in the order of
    //id,name,weight,height,types,sprite,genus, and entry
    let newPokemon = new Pokemon(
      finalData[0][0], //id
      finalData[0][1], //name
      finalData[1][0], //weight
      finalData[1][1], //height
      finalData[1][2], //types
      finalData[1][3], //sprites
      finalData[0][2], //genus
      finalData[0][3] //entry
    )
    nationalPokedex[i] = newPokemon
  }
  return nationalPokedex;
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

    let dataSet1 = [id,
      name,
      genus,
      entry
    ];

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
    let dataSet2 = [weight,
      height,
      type,
      sprite
    ];
    return dataSet2;

  } catch (err) {
    console.log(err);
  }
}


//Neat way to obtain the whole pokedex instead of having to do generatePokedex.then()
async function getNationalPokedex() {
  const finalPokedex = await generatePokedex();
  console.log(finalPokedex);
  return finalPokedex;
}

getNationalPokedex();

app.listen(3000, () => {
  console.log('Server started on port 3000');
}); //Server is tuning into the channel 3000