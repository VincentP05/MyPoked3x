//This is where all the calls will be made and etc.
//Sorting algorithms will also go here
const express = require('express');
const app = express();
const path = require('path');
const controller = require('./controller');
const database = require('./database');

//Request endpoints will be handled in controller.js
app.use('/search', controller);

app.set('views', path.join(__dirname, '../views'));

app.set('view engine', 'ejs');

//Goes to parent directory of Poked3x
const reqPath = path.join(__dirname, '..');

//This loads up all the html and css files in frontend
app.use(express.static(reqPath + '/public'));

//Loads up home page
app.get('/', (req, res) => {
  res.redirect('/search/bar');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
}); //Server is tuning into the channel 3000