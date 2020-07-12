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
    initPokeData(pokeID);
}

//function doing all the calls to pokeapi
async function initPokeData(pokemonID) {
    const pokemon = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonID}/`
    );
    const pokeData = await pokemon.json();
    //if pokeData is returned, it is still a promise (A hassle)
    converter(pokeData);
}

function converter(data) {
    let id = data.id;
    let name = data.name;
    let genus = data.genera[7].genus;
    let entry;

    //entries vary between games
    if (id <= 151)
        //Platinum-gen1
        entry = data.flavor_text_entries[13].flavor_text;
    else if (id >= 152 || id <= 251)
        //Platinum-gen2
        entry = data.flavor_text_entries[10].flavor_text;
    else if (id >= 252 || id <= 386)
        //Emerald-gen3
        entry = data.flavor_text_entries[2].flavor_text;
    else if (id >= 387 || id <= 493)
        //Platinum-gen4
        entry = data.flavor_text_entries[2].flavor_text;
    else if (id >= 494 || id <= 649)
        //BW2-gen5
        entry = data.flavor_text_entries[5].flavor_text;
    else if (id >= 650 || id <= 721)
        //Y-gen6
        entry = data.flavor_text_entries[14].flavor_text;
    else if (id >= 722 || id <= 802)
        //USUM-gen7
        entry = data.flavor_text_entries[17].flavor_text;
    else if (id >= 803 || id <= 807)
        //USUM-gen7
        entry = data.flavor_text_entries[7].flavor_text;

    p.getPokemonByName(name)
        .then((res) => {
            //hectograms to kilograms
            let weight = res.weight * 0.1;
            //decimeters to meters
            let height = res.height * 0.1;
            let type = res.types;
            let sprite = res.sprites.front_default;
            let allInfo = {
                id,
                name,
                weight,
                height,
                type,
                sprite,
                genus,
                entry
            }
            createPokemonObj(allInfo)
        })
        .catch((err) => {
            console.log('There was an error: ', err);
        });
}

function createPokemonObj(PokemonData) {
    console.log(PokemonData);
}
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