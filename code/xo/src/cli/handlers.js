'use strict'

// import the state library
const State = require('./state')

// import the text formatting library
const Formatters = require('./formatters')

// import the CLI utils library
const keyUtils = require('./key')

// import the Transaction library
const Transaction = require('./transaction')

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
    .then(function(gameList) {

      if(args.format == 'json') {
        console.log(Formatters.asJson(gameList))
      }
      else {
        console.log(Formatters.listGamesTable(gameList))
      }
    })
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
  const state = State(args.url)

  state
    .loadGame(args.name)
    .then(function(gameData) {

      // if the game is not found then error
      if(!gameData) {
        console.error(`There was no game found with the name: ${args.name}`)
        process.exit(1)
      }

      if(args.format == 'json') {
        console.log(Formatters.asJson(gameData))
      }
      else {
        console.log(Formatters.gameToString(gameData))
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
  
  const state = State(args.url)

  // load the keys from disk based on the keyDir and keyName
  const keys = keyUtils.getKeys(args.keyDir, args.keyName)

  // create a signer using our private key
  const signer = Transaction.createSigner(keys.private)

  // create a payload representing a create new game action
  const payload = [args.name, 'create', ''].join(',')

  // create the signed transaction ready to send
  // this will return the raw binary we will send to the rest api
  const batchListBytes = Transaction.singleTransactionBytes({
    signer: signer,
    gameName: args.name,
    payload: payload,
  })

  // send the batch list bytes to the rest api
  state
    .sendBatch(batchListBytes)
    .then(_submitBatchListHandler(state, args.format, args.wait))
    .catch(_errorHandler)
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
  
  const state = State(args.url)

  // load the keys from disk based on the keyDir and keyName
  const keys = keyUtils.getKeys(args.keyDir, args.keyName)

  // create a signer using our private key
  const signer = Transaction.createSigner(keys.private)

  // create a payload representing a create new game action
  const payload = [args.name, 'take', args.space].join(',')

  // create the signed transaction ready to send
  // this will return the raw binary we will send to the rest api
  const batchListBytes = Transaction.singleTransactionBytes({
    signer: signer,
    gameName: args.name,
    payload: payload,
  })

  // send the batch list bytes to the rest api
  state
    .sendBatch(batchListBytes)
    .then(_submitBatchListHandler(state, args.format, args.wait))
    .catch(_errorHandler)
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
  const state = State(args.url)

  // load the keys from disk based on the keyDir and keyName
  const keys = keyUtils.getKeys(args.keyDir, args.keyName)

  // create a signer using our private key
  const signer = Transaction.createSigner(keys.private)

  // create a payload representing a create new game action
  const payload = [args.name, 'delete', ''].join(',')

  // create the signed transaction ready to send
  // this will return the raw binary we will send to the rest api
  const batchListBytes = Transaction.singleTransactionBytes({
    signer: signer,
    gameName: args.name,
    payload: payload,
  })

  // send the batch list bytes to the rest api
  state
    .sendBatch(batchListBytes)
    .then(_submitBatchListHandler(state, args.format, args.wait))
    .catch(_errorHandler)
}

// generic handler for submitted transactions
// if the wait flag is set - we wait for the 
// submitted transaction status to be COMMITTED or INVALID
// and print the status
// otherwise we print the batch id
function _submitBatchListHandler(state, format, wait) {
  return function(batchId) {
    // wait for the 
    if(wait) {

      state.waitBatch(batchId, function(err, batchStatus){
        if(err) {
          console.error(err)
          process.exit(1)
        }
        if(format == 'json') {
          console.log(Formatters.asJson(batchStatus))
        }
        else {
          console.log(Formatters.submittedBatch(batchStatus))
        }
      })
    }
    else {
      if(format == 'json') {
        console.log(Formatters.asJson({
          batchId: batchId, 
        }))
      }
      else {
        console.log(`batch id: ${batchId}`)
      }
    }
  }
}

// generic error handler for rest api responses
// prints error messages from the validator if they are present
function _errorHandler(err) {
  if(err.response && err.response.data && err.response.data.error) {
    const error = err.response.data.error
    console.error(`error code ${error.code} - ${error.title}`)
    console.error(`${error.message}`)
  }
  else if(err.response && err.response.data) {
    console.error(err.response.data)
  }
  else {
    console.error(`error ${err}`)
  }
}

module.exports = {
  listGames: listGames,
  createGame: createGame,
  showGame: showGame,
  playGame: playGame,
  deleteGame: deleteGame,
}
