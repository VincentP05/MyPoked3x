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
    defaultPokemon.getNormID(),
];


//Using this to handle undefined issue
let temp = new Array(1);

//When search route is targeted
router
    .route('/pokemon') //Dealing with /search/bar , router object already starts with /search
    .get((req, res) => {
        //There are 12 pokemon, who are exceptions, and I do not know why the api was written like this,
        //but there entries are in spanish, which makes no sense. When all the other people are in english. 
        //Switch statement will be used to manually fix this
        switch (pokemonTraits[8]) {
            case 663:
                pokemonTraits[7] = "When attacking prey, it can reach speeds of up to 310 mph. It finishes its prey off with a colossal kick."
                break;
            case 670:
                pokemonTraits[7] = "When the flowers of a well-tended flower bed bloom, it appears and celebrates with an elegant dance."
                break;
            case 697:
                pokemonTraits[7] = "Nothing could stop this Pokémon 100 million years ago, so it behaved like a king."
                break;
            case 698:
                pokemonTraits[7] = "This calm Pokémon lived in a cold land where there were no violent predators like Tyrantrum."
                break;
            case 705:
                pokemonTraits[7] = "Its four horns are a high-performance radar system. It uses them to sense sounds and smells, rather than using ears or a nose."
                break;
            case 715:
                pokemonTraits[7] = "The ultrasonic waves it emits from its ears can reduce a large boulder to pebbles. It swoops out of the dark to attack."
                break;
            case 736:
                pokemonTraits[7] = "It spits a sticky thread to stop opponents in their tracks, and then it grabs them in its sharp, sturdy mandibles to take them down."
                break;
            case 764:
                pokemonTraits[7] = "Baths prepared with the flowers from its vine have a relaxing effect, so this Pokémon is a hit with many people."
                break;
            case 780:
                pokemonTraits[7] = "This Pokémon is friendly to people and loves children most of all. It comes from deep in the mountains to play with children it likes in town."
                break;
            case 793:
                pokemonTraits[7] = "It appeared in this world from an Ultra Wormhole. Nihilego appears to be a parasite that lives by feeding on people and Pokémon."
                break;
            case 794:
                pokemonTraits[7] = "A mysterious life-form called an Ultra Beast. Witnesses saw it pulverize a dump truck with a single punch."
                break;
            case 798:
                pokemonTraits[7] = "One of the Ultra Beast life-forms, it was observed cutting down a gigantic steel tower with one stroke of its blade."
                break;
        }

        res.render('pokedex', {
            id: pokemonTraits[0],
            name: pokemonTraits[1],
            weight: pokemonTraits[2],
            height: pokemonTraits[3],
            types: pokemonTraits[4],
            sprites: pokemonTraits[5],
            genus: pokemonTraits[6],
            entry: pokemonTraits[7],
            regID: pokemonTraits[8]
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

                //On error, value should be nothing and a symbol should appear 
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
            const i = newPokemon.getNormID();

            //Data put into global array
            pokemonTraits = [a, b, c, d, e, f, g, h, i];
            temp[0] = 1;
        }
    })
}



module.exports = router