//Deals with speech to text
// and text to speech
const recorder = require('node-record-lpcm16');

const speech = require('@google-cloud/speech');

const client = new speech.SpeechClient()
//function to take in text, when audio button is clicked

//if checkbox for audio is checked off
//plays a function that will read pokemon name, genus,
//and its entry.