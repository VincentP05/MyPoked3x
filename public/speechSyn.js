//Init SpeechSynth API
const synth = window.speechSynthesis;

//Text that will be read
const pokName = document.querySelector('#pokName');
const genus = document.querySelector('#genus');
const entry = document.querySelector('#entry');

//Checkbox
const checkBox = document.getElementById('audio');

//Check if a localStorage exist or not
//if it has never existed before default value is no
//if it does exist, take that yes or no value, and check the box yes or no

if (localStorage.getItem('checked') === null) {
    localStorage.setItem('checked', checkBox.value);
}

let check = localStorage.getItem('checked');

//Loads previous values
if (check == 'yes') checkBox.checked = true;
else checkBox.checked = false;

let searchBar = document.querySelector('.search-txt');
let searchButton = document.querySelector('.search-btn');

//If any changes to the checkbox is made
checkBox.addEventListener('click', () => {
    if (checkBox.checked == true) {
        check = 'yes';
        localStorage.setItem('checked', check);
        searchBar.value = (pokName.textContent).replace(/\s+/g, '-');
        searchButton.click();
    } else {
        check = 'no';
        synth.cancel();
        localStorage.setItem('checked', check);
    }
});

//Speech synth stuff
let voices = [];

function getVoices() {
    voices = synth.getVoices();
};



getVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

const speak = () => {
    //Speak text
    let text = '' + pokName.textContent + ', the ' + genus.textContent + '.' +
        ' ' + entry.textContent + '.';
    let speakText = new SpeechSynthesisUtterance(text);

    //Speak Error
    speakText.onerror = e => {
        console.log('Something went wrong ' + e.error);
    }

    //Selected voice 
    //Microsoft Zira
    speakText.voice = voices[0];

    //Set pitch and rate
    speakText.rate = 1;
    speakText.pitch = 1;

    //Speak
    synth.speak(speakText);
}

if ((localStorage.getItem('checked')) == 'yes') {
    speak();
}

//lets remove the event listener and just have audio play, when a new page
//or something is created and if the check box is checked