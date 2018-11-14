'use strict'

/*

  library for reading the state of the XO namespace

  we use the `/state` rest api endpoint to load data from beneath an address

  for listing games - we load all state entries below the transaction family
  prefix

  for loading a single game - we construct an address for the specific game
  based on the prefix + game name
  
*/

// when we communicate with the validator set a timeout
// value which is the maximum amount of time a request is allowed to take
const TIMEOUT = 1000

// import the address library which knows how to construct Sawtooth
// addresses based on the transaction family name and the game name
const Address = require('../shared/address')

// a function that knows how to process an encoded data into game objects
// splitting by , (because the XO transaction family uses CSV encoding)
function deserialize(csvString) {

  // if there is no data then return nothing
  if(!csvString) return null

  // there should only be a single game at the given address
  // the XO transaction family specification states that we should
  // be joining multiple values using the | character
  // this is a defensive move to account for accidental address collisions

  // always use the first string found - ignore the split by | part of the
  // xo tp family specification for the sake of leaning
  const gameString = csvString.split('|')[0]

  // split the gameString into an array of parts
  const csvParts = gameString.split(',')

  // return an object turning the positional values into named keyd
  return {

    // the name of the game
    name: csvParts[0],

    // the current representation of the board
    board: csvParts[1],

    // the current state of the game
    state: csvParts[2],

    // the signing key used for player1
    player1: csvParts[3],

    // the signing key used for player2
    player2: csvParts[4],
  }
}

// a function that knows how to encode a of game object into the data
// string we can save back to the validator state tree
// this involves CSV encoding the game object
function serialize(gameObject) {

  // create an array with the keys in the correct order
  const gameParts = [
    gameObject.name,
    gameObject.board,
    gameObject.state,
    gameObject.player1,
    gameObject.player2,
  ]

  // join the gameParts using a comma and return that string
  return gameParts.join(',')
}

// the main library constructor which accepts the SDK context object
function XOState(context) {

  // load the game that is currently saved under the given name
  // create the address using the shared address library
  // then call getState before deserializing the found entry
  // this function returns a Promise to be resolved by the callee
  function getGame(name) {

    // get the address for the given game name
    const address = Address.gameAddress(name)

    // call the 'getState' of the validator to load the data
    // at the game address
    return context.getState([address], TIMEOUT)
      .then(function(addressValues) {

        // addressData = {'ADDRESS': 'DATA'}
        // addressValues is an object of found state
        // the key is the actual address of the data
        // the value is a binary value of the actual state
        
        // load the data for our actual game address
        // this is a binary value
        const binaryAddressData = addressValues[address]

        // convert the binary value into a string
        const stringAddressData = binaryAddressData.toString()

        // return a game object that is deserialized from the given string
        return deserialize(stringAddressData)
      })
  }

  // set the game with the given name
  // we serialize the game data and write it to the validator
  // at the address constructed using the given game name
  function setGame(name, gameObject) {
    
    // first we serialize the gameObject into a CSV string using the serialize function
    const gameCSVString = serialize(gameObject)

    // turn the CSV string into binary data
    const gameBinaryData = Buffer.from(gameCSVString)

    // get the address for the given game name
    const address = Address.gameAddress(name)

    // create a map of address -> data that we will send to the validator
    const stateEntries = {
      [address]: gameBinaryData
    }

    // send the new game state to the validator
    // return the promise to the caller of this function
    return context.setState(stateEntries, TIMEOUT)
  }

  // delete the game with the given name
  // this uses the deleteState function of the core SDK
  // we use an address constructed using the given game name
  function deleteGame(name) {
    // get the address for the given game name
    const address = Address.gameAddress(name)

    return context.deleteState([address], TIMEOUT)
  }

  // return an object with each of the state methods
  return {
    getGame: getGame,
    setGame: setGame,
    deleteGame: deleteGame,
  }
}

module.exports = XOState