//This is where user inputs are going to be taken, then request will be sent
//All failed request or whatever are handled here
//This file will deal with CRUD
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const _ = require('lodash');
//relative path
const Pokemon = require('./pokemon.js');
let router = express.Router();

//router.set('view engine', 'ejs');

//Homepage
router
    .route('/search')


module.exports = router