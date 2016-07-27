'use strict'

var app = angular.module('myApp', ['ui.router', 'ngSanitize']);

app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider

      .state('home', {url: '/', templateUrl: 'html/homePage.html'})
      .state('startGameScreen', {url: '/startGameScreen', templateUrl: 'html/startGameScreen.html', controller: 'startGameScreenCtrl'})
      .state('playerScreen', {url: '/playerScreen', templateUrl: 'html/playerScreen.html', controller: 'playerScreenCtrl'})
      .state('judgeScreen', {url: '/judgeScreen', templateUrl: 'html/judgeScreen.html', controller: 'judgeScreenCtrl'})
      .state('endGameScreen', {url: '/endGameScreen', templateUrl: 'html/endGameScreen.html', controller: 'endGameScreenCtrl'})

    //user tries to go somewhere we dont have, just send to home
    $urlRouterProvider.otherwise('/');
});
