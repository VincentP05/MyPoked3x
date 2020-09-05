//Gets all pokemon names from pokemonList
import allPokemons from './pokemonList.js'

//Web Speech Api runs on browser, no node support
//Deals with speech to text
// and text to speech

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

//The grammer
let pokemons = allPokemons;

//Allows detecting names of pokemon easier
let grammer = '#JSGF V1.0; grammar pokemons; public <pokemon> = ' + pokemons.join(' | ') + ' ;';

let recognition = new SpeechRecognition();
let speechRecognitionGrammerList = new SpeechGrammarList();
speechRecognitionGrammerList.addFromString(grammer, 1);

recognition.grammers = speechRecognitionGrammerList;
recognition.lang = 'en-US';
//Get the words as the user is speaking, (true)
//or get the words after the user is finish speaking (false)
recognition.interimResults = false;

let searchBar = document.querySelector('.search-txt');
let searchButton = document.querySelector('.search-btn');
let microphoneBtn = document.querySelector('#microphone-btn');

recognition.onresult = (event) => {
    let last = event.results.length - 1;
    let name = event.results[last][0].transcript;
    //it doesn't matter what user inputs, if it is invalid
    //the controller will deal with it
    searchBar.placeholder = 'Search Pokemon';
    searchBar.value = name;
    searchButton.click();
    microphoneBtn.disabled = false;
};

const synth = window.speechSynthesis;
//Whenever the search button is clicked, by microphone input
//or manual input, there will be a check done to see if the input is valid or not
searchButton.addEventListener('click', () => {
    let name = _.startCase(_.toLower(searchBar.value));
    //Replaces spaces with -
    name = name.replace(/\s+/g, '-')
    //When user goes to next people, audio from last pokemon is canceled
    synth.cancel();
    setTimeout(() => {
        //Below capitalizes each first letter of the name,
        //since pokemonList strings start with capital
        if (pokemons.includes(name) == false) {
            message.textContent = 'Invalid Input';
            searchBar.value = '';
            setTimeout(() => {
                message.textContent = '';
            }, 3000);
        }
    }, 200)
    //Checks if pokemon they entered is part of the list or not

})


//When the user finishes speaking, it stops listening
recognition.onspeechend = () => {
    recognition.stop();
};

//What happens when an error occurs
recognition.onerror = (event) => {
    message.textContent = 'Error: ' + event.error;
    searchBar.placeholder = 'Search Pokemon';
    microphoneBtn.disabled = false;
    setTimeout(() => {
        message.textContent = '';
    }, 4000)
};

//When microphone button is clicked, speech recognition starts
microphoneBtn.addEventListener('click', () => {
    searchBar.placeholder = 'Listening...';
    message.textContent = '';
    recognition.start();
    //Avoid spamming the microphone button, which causes crashes
    microphoneBtn.disabled = true;
    //Below is for muffled audio, web speech api doesn't understand
    //If proper audio is picked up before 7 seconds, this part will not play
    setTimeout(() => {
        searchBar.placeholder = 'Search Pokemon';
        microphoneBtn.disabled = false;
        searchBar.value = '';
        message.textContent = 'Please Try Again';
        setTimeout(() => {
            message.textContent = '';
        }, 3000);
    }, 8000)
});

//function to take in text, when audio button is clicked

//if checkbox for audio is checked off
//plays a function that will read pokemon name, genus,
//and its entry.