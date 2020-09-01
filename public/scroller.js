//dynamic html/css for the scroll wheel
import allPokemons from './pokemonList.js';

let pokemons = allPokemons;

let scrollbox = document.querySelector('.scroll-box');
let searchBar = document.querySelector('.search-txt');
let searchButton = document.querySelector('.search-btn');

let i;

const handleListItemClick = (e) => {
    //console.log(e.target);
    if (!e.target) return;

    const listItem = e.target;
    if (!listItem.textContent) return;

    const pokeName = listItem.textContent.split(' ')[1];
    searchBar.value = pokeName;
    searchButton.click();
};

for (i = 0; i < pokemons.length - 2; i++) {
    const listItem = document.createElement("DIV");
    listItem.innerHTML = "<p>" + '#' + (i + 1).toString().padStart(3, '0') + ' ' + pokemons[i] + "</p>";
    listItem.addEventListener('click', handleListItemClick);
    scrollbox.appendChild(listItem);
}

//Next and Previous button here as well, since the code for this wont be too long
let leftBtn = document.querySelector('.left-button');
let rightBtn = document.querySelector('.right-button');
let uniqueID = document.querySelector('#regID');

leftBtn.addEventListener('click', () => {
    //pokeId is the current array index of pokemons
    const pokeId = Number(uniqueID.value) - 1;
    if (pokeId > 0) {
        //previous pokemon we want to see
        let prevPokemon = pokemons[pokeId - 1];
        searchBar.value = prevPokemon;
        searchButton.click();
    }

})

rightBtn.addEventListener('click', () => {
    //pokeId is the current array index of pokemons
    const pokeId = Number(uniqueID.value) - 1
    if (pokeId < 806) {
        //next pokemon we want to see
        let nextPokemon = pokemons[pokeId + 1];
        searchBar.value = nextPokemon;
        searchButton.click();
    }

})