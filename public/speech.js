//I will need a way to import pokemon names in from database

//Web Speech Api runs on browser, no node support
//Deals with speech to text
// and text to speech
let message = document.querySelector('#message');

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

//The grammer
let pokemonNames = [];

let grammer = '#JSGF V1.0';

let recognition = new SpeechRecognition();
let speechRecognitionGrammerList = new SpeechGrammarList();
speechRecognitionGrammerList.addFromString(grammer, 1);

recognition.grammers = speechRecognitionGrammerList;
recognition.lang = 'en-US';
//Get the words as the user is speaking, (true)
//or get the words after the user is finish speaking (false)
recognition.interimResults = false;

// onresult
// onspeechend
// onerror

let searchBar = document.querySelector('.search-txt');
let searchButton = document.querySelector(".search-btn");

recognition.onresult = (event) => {
    let last = event.results.length - 1;
    let name = event.results[last][0].transcript;
    //it doesn't matter what user inputs, if it is invalid
    //the controller will deal with it
    searchBar.placeholder = 'Search Pokemon';
    searchBar.value = name;
    searchButton.click();

}

//When the user finishes speaking, it stops listening
recognition.onspeechend = () => {
    recognition.stop();
}

//What happens when an error occurs
recognition.onerror = (event) => {
    message.textContent = 'Error occured in recognition: ' + event.error;
}

//When microphone button is clicked, speech recognition starts
document.querySelector('#microphone-btn').addEventListener('click', () => {
    searchBar.placeholder = 'Listening...';
    recognition.start();
})





//function to take in text, when audio button is clicked

//if checkbox for audio is checked off
//plays a function that will read pokemon name, genus,
//and its entry.