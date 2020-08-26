//This is where user inputs are going to be taken, then request will be sent
//All failed request or whatever are handled here
//This file will deal with CRUD
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const database = require('./database.js');
//relative path
const Pokemon = require('./pokemon.js');
const {
    set
} = require('lodash');
let router = express.Router();

router.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

//Array to temporarily hold any required data
//default value is bulbasaur
let defaultPokemon = new Pokemon(1, 'bulbasaur', 69, 7,
    [{
        "slot": 1,
        "type": {
            "name": "grass",
            "url": "https://pokeapi.co/api/v2/type/12/"
        }
    }, {
        "slot": 2,
        "type": {
            "name": "poison",
            "url": "https://pokeapi.co/api/v2/type/4/"
        }
    }],
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', 'Seed Pokemon',
    "For some time after its birth, it\ngrows by gaining nourishment from\nthe seed on its back.")

//Initially is bulbasaur, but changes on post requests
let pokemonTraits = [
    defaultPokemon.getID(),
    defaultPokemon.getName(),
    defaultPokemon.getWeight(),
    defaultPokemon.getHeight(),
    defaultPokemon.getTypes(),
    defaultPokemon.getSprite(),
    defaultPokemon.getGenus(),
    defaultPokemon.getEntry(),
];


//Using this to handle undefined issue
let temp = new Array(1);

//When search route is targeted
router
    .route('/pokemon') //Dealing with /search/bar , router object already starts with /search
    .get((req, res) => {
        res.render('pokedex', {
            id: pokemonTraits[0],
            name: pokemonTraits[1],
            weight: pokemonTraits[2],
            height: pokemonTraits[3],
            types: pokemonTraits[4],
            sprites: pokemonTraits[5],
            genus: pokemonTraits[6],
            entry: pokemonTraits[7],
        });
    }) //Returns the name of the pokemon from search bar
    .post((req, res) => {
        //Updates EJS values, which then redirect to be changed by get
        const searchPokemon = req.body.pokemon;
        let pokemonLowerCase = _.toLower(searchPokemon);
        //For pokemon like farfetch'd, database removed the apostrophe
        pokemonLowerCase = pokemonLowerCase.replace("'", "");
        validatePokemon(_.toLower(pokemonLowerCase));
        //Find requires a bit of time
        //Do this so temp[] can be updated 
        //Prior to this temp[] always ran the default value, which is undefined
        setTimeout(() => {
            console.log(temp[0]);
            if (temp[0] == 1) {
                res.redirect('/search/pokemon')
            } else {
                //Put an alert or something to notify user that input is not a Pokemon
                console.log('Invalid Input');
            }
            temp = [];
        }, 200)

    });

function validatePokemon(name) {

    database.find({
        name: `${name}`
    }, (err, foundPokemon) => {
        if (err) {
            console.log(err);
        } else if (foundPokemon.length == 0 || foundPokemon === undefined) {
            //Invalid input
            temp[0] = 0;
        } else {
            //Extract data from database
            const id = foundPokemon[0].id
            const name = foundPokemon[0].name
            const weight = foundPokemon[0].weight
            const height = foundPokemon[0].height
            const types = foundPokemon[0].types
            const sprites = foundPokemon[0].sprites
            const genus = foundPokemon[0].genus
            const entry = foundPokemon[0].entry

            //Create Pokemon Objects
            const newPokemon = new Pokemon(id, name, weight,
                height, types, sprites, genus, entry);

            //Refine data through Pokemon class methods
            const a = newPokemon.getID();
            const b = newPokemon.getName();
            const c = newPokemon.getWeight();
            const d = newPokemon.getHeight();
            const e = newPokemon.getTypes();
            const f = newPokemon.getSprite();
            const g = newPokemon.getGenus();
            const h = newPokemon.getEntry();

            //Data put into global array
            pokemonTraits = [a, b, c, d, e, f, g, h];
            temp[0] = 1;
        }
    })
}



module.exports = router