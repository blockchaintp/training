'use strict'

// import the state library
const State = require('./state')

// import the text formatting library
const Formatters = require('./formatters')

/*

  the list command handler

   * call the loadGames method of the state library
   * format the output

  args:

   * url - the url of the restAPi server
   * format - the format for the output
  
*/
function listGames(args) {
  const state = State(args.url)

  state
    .loadGames()
    .then(function(data) {

      if(args.format == 'json') {
        console.log(Formatters.asJson(data))
      }
      else {
        console.log(Formatters.listGamesTable(data))
      }
    })
}

/*

  the create command handler

   * check the keys exist
   * create a new transaction
   * call the createGame method of the state library
   * format the output

  args:

   * name - the name of the new game
   * url - the url of the restAPi server
   * keyDir - the directory the keys live in
   * keyName - the name of the key to use when submitting the transaction
   * wait - whether to wait for the transaction status to complete or error
   * format - the format for the output
  
*/
function createGame(args) {
  console.log('-------------------------------------------');
  console.dir(args)
}

/*

  show the details of an existing game

   * call the loadGame method of the state library
   * format the output

  args:

   * url - the url of the restAPi server
   * name - the name of the existing game
   * format - the format for the output
  
*/
function showGame(args) {
  console.log('-------------------------------------------');
  console.dir(args)
}

/*

  take a space in an existing game

   * check the keys exist
   * create a new transaction
   * call the playGame method of the state library
   * format the output

  args:

   * name - the name of the new game
   * space - the space to take in the game
   * url - the url of the restAPi server
   * keyDir - the directory the keys live in
   * keyName - the name of the key to use when submitting the transaction
   * wait - whether to wait for the transaction status to complete or error
   * format - the format for the output
  
*/
function playGame(args) {
  console.log('-------------------------------------------');
  console.dir(args)
}

/*

  delete an existing game

   * check the keys exist
   * create a new transaction
   * call the deleteGame method of the state library
   * format the output

  args:

   * name - the name of the new game
   * url - the url of the restAPi server
   * keyDir - the directory the keys live in
   * keyName - the name of the key to use when submitting the transaction
   * wait - whether to wait for the transaction status to complete or error
   * format - the format for the output
  
*/
function deleteGame(args) {
  console.log('-------------------------------------------');
  console.dir(args)
}

module.exports = {
  listGames: listGames,
  createGame: createGame,
  showGame: showGame,
  playGame: playGame,
  deleteGame: deleteGame,
}
