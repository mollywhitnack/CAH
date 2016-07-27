'use strict';

console.log("in deck model")

const path = require('path');
const fs = require('fs');

let dpath = path.join(__dirname, '../cardData/cards.json');


exports.getAll = function (){
  return new Promise (function (resolve, reject){
    fs.readFile(dpath, 'utf-8', (err, data) =>{
      if(err) return reject(err);
      //console.log("data: ", JSON.parse(data));
      var cardData = JSON.parse(data);
      var whiteCards = cardData.whiteCards;
      var blackCards = cardData.blackCards;

      console.log("whiteCards:", whiteCards);
      console.log("BlackCards:", blackCards);
      resolve(cardData);
    })
  })
}
