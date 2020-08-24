const mongoose = require('mongoose');

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

module.exports = mongoose.model('Pocketmon', pokemonSchema);