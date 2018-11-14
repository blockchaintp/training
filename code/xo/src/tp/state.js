'use strict'

/*

  library for managing the state of a transaction processor

  Create, Retreive, Update, Delete (i.e. CRUD) actions are the main
  concern of this library

  we are given a 'context' which is a core SDK object that has the
  following key methods:

   * getState - read state from an address prefix
   * setState - set state to an address
   * deleteState - delete state from an address

  Each of these methods will mutate the state associated with the given
  address

  They all return Promises which is a way in Javascript of handling the 
  asynchronous nature of the underlying api 
  
*/

// when we communicate with the validator set a timeout
// value which is the maximum amount of time a request is allowed to take
const TIMEOUT = 1000

// import the address library which knows how to construct Sawtooth
// addresses based on the transaction family name and the game name
const Address = require('../shared/address')

// import the encoding library which knows how to encode and decode the
// state of a game into/from a single string
const Encoding = require('../shared/encoding')

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
        return Encoding.deserialize(stringAddressData)
      })
  }

  // set the game with the given name
  // we serialize the game data and write it to the validator
  // at the address constructed using the given game name
  function setGame(name, gameObject) {
    
    // first we serialize the gameObject into a CSV string using the serialize function
    const gameCSVString = Encoding.serialize(gameObject)

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

    // call the deleteState method on the validator
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