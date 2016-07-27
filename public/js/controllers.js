'use strict'

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, $http, $state, Deck){

	const HANDSIZE = 10;
	const SCORETOWIN = 2;

	$scope.startGame = {
		numPlayers:6,
		names:[],
		poops:[],
	};

	$scope.currCzarName;

	$scope.$watch('startGame.numPlayers', function(newVal,oldVal) {
		$scope.startGame.numPlayersArray = makeNumPlayersArray(newVal);
	},true);

	$scope.currPlayer;
	var whiteCards;
	var blackCards;
	$scope.currBlackCard;



	function makeNumPlayersArray(num){
		return new Array(num);
	}


	$scope.startGame = function(){
		fillBlackDeck()
		.then(fillWhiteDeck)
		.then(function (){
			getBlackCard();
			createPlayers();
			//  reset submittedWhiteCards with space for each player's submission
			//  there are holes in the array.
			$scope.submittedWhiteCards = [];
			for (let i = 0; i < $scope.startGame.numPlayers; i++){
				if(!$scope.players[i].czar)
					$scope.submittedWhiteCards[i] = [];
			}

			pickCzar();
			swal({ title: `${$scope.players[$scope.currPlayer].name}'s Turn`}, goToStart);

		})
		.catch(err=>{
			console.log(err);
		});
	}

	function goToStart(){
		$state.go('playerScreen');
	}


	function populateHands(){
		for (let i = 0, len = $scope.players.length; i < len; i++){
			$scope.players[i].hand.push(...getWhiteCards(HANDSIZE - $scope.players[i].hand.length))
		}
	}


	$scope.judgePicks = index => {
		//  winning player goes first next round
		$scope.currPlayer = index;
		$scope.players[$scope.currPlayer].score++;
		if($scope.players[$scope.currPlayer].score === SCORETOWIN){
			$scope.winner = $scope.players[$scope.currPlayer].name; //calls name of winner
			$state.go('endGameScreen');

		}
		else {
			populateHands();
			//check if previous player was the czar
			let nextNameIndex = ($scope.currPlayer);
			if( $scope.players[($scope.currPlayer + $scope.players.length-1) % $scope.players.length].czar)
				nextNameIndex = (nextNameIndex + 1)% $scope.players.length;
			swal({title: `${$scope.players[$scope.currPlayer].name} wins this round!`,  text: `next player is: ${$scope.players[nextNameIndex].name}`}, newRound);
			//  sweetAlert triggers
		}
	}

	$scope.clearScore = () => {


	}


	function newRound(){
		getBlackCard();

		$state.go('playerScreen');
		changeCzar();
		if ($scope.players[$scope.currPlayer].czar)
			$scope.currPlayer = ($scope.currPlayer + 1) % $scope.players.length;
		$scope.submittedWhiteCards = [];
		for (let i = 0; i < $scope.startGame.numPlayers; i++){
			if(!$scope.players[i].czar)
				$scope.submittedWhiteCards[i] = [];
		}
	}


	function changeCzar() {
		let previousCzar = 0;
		for(var index = 0, len = $scope.players.length; index < $scope.players.length ; index++){
			if ($scope.players[index].czar) {
				previousCzar = index;
			}
			$scope.players[index].czar = false;
		}
		$scope.players[(previousCzar + 1) % $scope.players.length].czar = true;
	}


	function fillWhiteDeck(){
		return Deck.getWhite()
		.then( res =>{
			whiteCards = res;
			whiteCards = shuffle(whiteCards);
		})
		.catch(err =>{
			console.log("err: ", err);
		})
	}

	function fillBlackDeck() {
		return Deck.getBlack()
		.then( res =>{
			blackCards = res;
			blackCards = shuffle(blackCards);
		})
		.catch(err =>{
			console.log("err: ", err);
		})
	}

	function createPlayers(){
		$scope.players = [];

		for(let i =0; i<$scope.startGame.numPlayers; i++){
			let playerToAdd = {
				name: $scope.startGame.names[i],
				hand: getWhiteCards(10),
				czar: false,
				score: 0,
				pooped: $scope.startGame.poops[i]
			}
			$scope.players.push(playerToAdd);
		}
	}

	function pickCzar(){
		var min = Infinity;
		var czarIndex = 0;
		for(let i =0; i< $scope.startGame.numPlayers; i++){
			if($scope.players[i].pooped < min){
				min = $scope.players[i].pooped;
				czarIndex =i;
			}
			$scope.players[czarIndex].czar = true;
		}
		$scope.currPlayer = (czarIndex + 1) % $scope.players.length;
		$scope.currCzarName = $scope.players[czarIndex].name;
	}

	function getBlackCard(){
		if(blackCards.length === 0){
			fillBlackDeck()
			.then(function() {
				$scope.currBlackCard = blackCards.splice(0, 1)[0];

			});
		} else {
			$scope.currBlackCard = blackCards.splice(0, 1)[0];

		}
	}

	function getWhiteCards(numCards){
		if(whiteCards.length < numCards){
			fillWhiteDeck()
			.then(function() {
				return whiteCards.splice(0, numCards);
			});
		} else {
			return whiteCards.splice(0, numCards);
		}
	}

	$scope.submitWhiteCard = function(card,index){
		card.player = $scope.currPlayer;
		$scope.submittedWhiteCards[card.player].push(card);
		$scope.players[card.player].hand.splice(index, 1);
		let length  = getLength($scope.submittedWhiteCards);
		if(!(length % $scope.currBlackCard.pick)){
			nextPlayer();
		}
	}


	function getLength(nestedArr){
		var flattened = nestedArr.reduce(function(a, b) {
			return a.concat(b);
		}, []);

		return flattened.length;
	}

	function nextPlayer(){

		$scope.currPlayer = ($scope.currPlayer + 1) % $scope.players.length;
		if($scope.players[$scope.currPlayer].czar === true)
			$scope.currPlayer = ($scope.currPlayer + 1) % $scope.players.length;

		let length  = getLength($scope.submittedWhiteCards);
		if(length === $scope.currBlackCard.pick*($scope.startGame.numPlayers -1)){
			$state.go('judgeScreen');
		}
		else{
			swal({ title: `${$scope.players[$scope.currPlayer].name}'s Turn`});
		}

	}


	function shuffle(array){
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}

});







app.controller('startGameScreenCtrl', function($scope, $stateParams){
});


app.controller('judgeScreenCtrl', function($scope, $stateParams){

});

app.controller('playerScreenCtrl', function($scope, $stateParams){
});

app.controller('endGameScreenCtrl', function($scope, $stateParams){
});
