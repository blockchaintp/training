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

const async = require('async')

// import the encoding library which knows how to encode and decode the
// state of a game into/from a single string
const Encoding = require('../shared/encoding')

// import the restapi library for communicating to the REST endpoints
const RestApi = require('./restapi')

// import the shared address library so we know what addresses to
// load state entries from
const Address = require('../shared/address')

// wait 100 milliseconds when we are waiting for a new batch submission
const WAIT_BATCH_TIME = 100

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

  // load a single game based on its name
  // we use the specific storage address for the game to do this
  function loadGame(name) {
    const gameAddress = Address.gameAddress(name)
    return RestApi
      .getState(restApiUrl, gameAddress)
      .then(function(body) {

        // the body of a state response will have the an array of addresses with their state entries
        // let's extract the data for this one game

        const gameStateEntry = body.data.filter(function(entry) {
          return entry.address == gameAddress
        })[0]

        if(!gameStateEntry) return null

        // now let's process the game data from the raw base64 bytes we have loaded

        // get the raw base64 data for the state entry
        const base64Data = gameStateEntry.data

        // convert it from base64 into a CSV string
        const rawGameData = Encoding.fromBase64(base64Data)

        // convert the CSV string into a game object
        return Encoding.deserialize(rawGameData)
      })
  }

  // send raw batch list bytes to the rest api
  // return the batch id once submitted
  function sendBatch(batchListBytes) {
    return RestApi
      .submitBatchList(restApiUrl, batchListBytes)
      .then(function(body) {
        // parse the link so we just return the id of the submitted batch
        const parts = body.link.split('?id=')
        return parts[1]
      })
  }

  function getBatchStatus(batchId) {
    return RestApi
      .getBatchStatus(restApiUrl, batchId)
      .then(function(body) {
        // filter the returned array down to the single status entry
        const status = body.data.filter(function(statusEntry) {
          return statusEntry.id == batchId
        })[0]
        return status
      })
  }

  // wait for the given batch to have a
  // COMMITTED or INVALID status back
  function waitBatch(batchId, done) {

    let pending = true
    let finalStatus = null

    async.whilst(
      function() {
        return pending
      },
      function(next) {
        setTimeout(function() {
          getBatchStatus(batchId)
            .then(function(batchStatus) {
              if(batchStatus.status == 'PENDING') {
                return next()
              }
              else {
                pending = false
                finalStatus = batchStatus
                return next()
              }
            })
            .catch(next)
        }, WAIT_BATCH_TIME)
      },
      function(error) {
        if(error) return done(error)
        return done(null, finalStatus)
      }
    )
  }

  return {
    loadGames: loadGames,
    loadGame: loadGame,
    sendBatch: sendBatch,
    waitBatch: waitBatch,
  }
}

module.exports = State