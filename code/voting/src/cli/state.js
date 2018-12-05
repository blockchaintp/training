'use strict'

const async = require('async')

const Encoding = require('../shared/encoding')
const RestApi = require('./restapi')
const Address = require('../shared/address')

// wait 100 milliseconds when we are waiting for a new batch submission
const WAIT_BATCH_TIME = 100

// we give the url of the rest-api to the state library
// so it can make HTTP requests to it
function State(restApiUrl) {

  // load the list of games using the VOTE_NAMESPACE prefix address
  function loadPeople() {
    return RestApi
      .getState(restApiUrl, Address.allPersonAddress())
      .then(function(body) {

        return body.data
          .map(function(personStateEntry) {

            const personDataString = Encoding.fromBase64(personStateEntry.data)

            const personData = Encoding.deserialize(personDataString)

            return personData
          })
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
    loadPeople: loadPeople,
    sendBatch: sendBatch,
    waitBatch: waitBatch,
  }
}

module.exports = State