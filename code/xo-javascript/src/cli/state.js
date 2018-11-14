'use strict'

/*

  library for reading the state of the XO namespace

  we use the `/state` rest api endpoint to load data from beneath an address

  for listing games - we load all state entries below the transaction family
  prefix

  for loading a single game - we construct an address for the specific game
  based on the prefix + game name

  for submitting a new transaction - we POST the raw binary transaction body
  to the `/batch` rest api endpoint

  each of these methods returns a promise that should be resolved by the caller
  
*/

// import the encoding library which knows how to encode and decode the
// state of a game into/from a single string
const Encoding = require('../shared/encoding')

// import the restapi library for communicating to the REST endpoints
const RestApi = require('./restapi')

// import the shared address library so we know what addresses to
// load state entries from
const Address = require('../shared/address')

// we give the url of the rest-api to the state library
// so it can make HTTP requests to it
function State(restApiUrl) {

  // load the list of games using the XO_NAMESPACE prefix address
  function loadGames() {
    return RestApi
      .getState(restApiUrl, Address.XO_NAMESPACE)
      .then(function(body) {

        // the body of a state response will have the an array of addresses with their state entries
        // let's map the raw game data into a processed version using the
        // encoding library
        return body.data
          .map(function(gameStateEntry) {

            // get the raw base64 data for the state entry
            const base64Data = gameStateEntry.data

            // convert it from base64 into a CSV string
            const rawGameData = Encoding.fromBase64(base64Data)

            // convert the CSV string into a game object
            return Encoding.deserialize(rawGameData)
          })
      })
  }

  return {
    loadGames: loadGames,
  }
}

module.exports = State