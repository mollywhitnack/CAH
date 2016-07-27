'use strict'

console.log("in decks");

const express = require('express');

let router = express.Router();

let Deck =require('../models/deck');

router.get('/', (req,res)=>{
  Deck.getAll()
  .then( deck =>{
    res.send(deck);
  })
  .catch(err =>{
    res.status(400).send(err);
  })

})


module.exports = router;