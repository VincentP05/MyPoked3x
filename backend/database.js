const mongoose = require('mongoose');
const fetch = require('node-fetch');

//Mongodb/mongoose connection
mongoose.connect('mongodb://localhost:27017/Pokedex', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

//Structure for how the pokemon's data will be stored
const pokemonSchema = {
    id: Number,
    name: String,
    weight: Number,
    height: Number,
    types: [{}],
    sprites: String,
    genus: String,
    entry: String,
};

let Pocketmon = mongoose.model('Pocketmon', pokemonSchema);

//If a pokedex does not already exist, a new pokedex will be created
Pocketmon.find({}, (err, pokemonList) => {
    if (pokemonList.length === 0) {
        //There are 807 Pokemon from generation 1 to 7
        const numOfPokemon = 807;
        //This will tell the application to create the pokemon,
        //and within generatePokedex(), the pokemon will be pushed to mongodb
        generatePokedex(numOfPokemon);
    } else {
        console.log("Pokedex already exists");
    }
})

//This function takes the data and makes an array of the pokemon
//async always returns a promise, also allows for the use of await
async function generatePokedex(numberOfPokemon) {
    let i;
    //An Array of all 807 Pokemon, starting with bulbasaur to zeraora
    let nationalPokedex = new Array(numberOfPokemon);

    for (i = 0; i < nationalPokedex.length; i++) {
        let pokeID = i + 1; //to get pokemon to show up in order make this function async, and put await in front of this line
        const data1 = initPokeData1(pokeID);
        const data2 = initPokeData2(pokeID);

        //line below halves the time, instead of having to await data1 and data2 individually, they run asynchronously
        const finalData = await Promise.all([data1, data2]); // id,name,genus,entry,weight,height,type,sprite
        //finalData is a array of arrays data1 and data2
        //we want the parameters to be in the order of
        //id,name,weight,height,types,sprite,genus, and entry
        const newPokemon = new Pocketmon({
            id: finalData[0][0], //id
            name: finalData[0][1], //name
            weight: finalData[1][0], //weight
            height: finalData[1][1], //height
            types: finalData[1][2], //types
            sprites: finalData[1][3], //sprites
            genus: finalData[0][2], //genus
            entry: finalData[0][3], //entry
        });
        nationalPokedex[i] = newPokemon;
    }
    Pocketmon.find({}, (err, pokemonList) => {
        Pocketmon.insertMany(nationalPokedex, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Pokemon successfully added to Pokedex');
            }
        })
    })
    //return nationalPokedex;
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

        //Platinum-gen1
        if (id <= 151)
            entry = pokeData.flavor_text_entries[13].flavor_text;
        //Platinum-gen2
        else if (id >= 152 && id <= 251)
            entry = pokeData.flavor_text_entries[10].flavor_text;
        //Emerald-gen3
        else if (id >= 252 && id <= 386)
            entry = pokeData.flavor_text_entries[2].flavor_text;
        //Platinum-gen4
        else if (id >= 387 && id <= 493)
            entry = pokeData.flavor_text_entries[2].flavor_text;
        //BW2-gen5
        else if (id >= 494 && id <= 649)
            entry = pokeData.flavor_text_entries[5].flavor_text;
        //Y-gen6
        else if (id >= 650 && id <= 721)
            entry = pokeData.flavor_text_entries[14].flavor_text;
        //USUM-gen7
        else if (id >= 722 && id <= 802)
            entry = pokeData.flavor_text_entries[17].flavor_text;
        //USUM-gen7
        else if (id >= 803 && id <= 807)
            entry = pokeData.flavor_text_entries[7].flavor_text;

        let dataSet1 = [id, name, genus, entry];

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
        let dataSet2 = [weight, height, type, sprite];
        return dataSet2;
    } catch (err) {
        console.log(err);
    }
}

module.exports = Pocketmon;