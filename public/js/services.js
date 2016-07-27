'use strict'

var app = angular.module('myApp');


app.service('Deck', function($http){

  this.getWhite = () =>{
      return $http({
      method: 'GET',
      url: '/decks'
    })
    .then(res =>{
     // console.log("res.data: ",res.data);
     return res.data.whiteCards.map(function(cardText){
        return  {
          text: cardText
        }
     })
    })
    .catch(err =>{
      console.error("Err: ", err);
    });
  }

  this.getBlack = () =>{
      return $http({
      method: 'GET',
      url: '/decks'
    })
    .then(res =>{
     // console.log("res.data: ",res.data);
     return res.data.blackCards;
    })
    .catch(err =>{
      console.error("Err: ", err);
    });
  }
})


