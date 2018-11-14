'use strict'

/*

  low level library for communicatiog with the restapi server

  this is used to speak to the following endpoints:

   * `/state` - read data entries under a given address
   * `/batches` - used to submit new transactions
   * `/batch_statuses` - used to read the status of new batches
  
  each of these methods will return a promise that should be resolved
  by the caller
*/

// import the base HTTP library
const axios = require('axios')

// load the state entries under a given address
function getState(restApiUrl, address) {
  return axios
    .get(`${restApiUrl}/state?address=${address}`)
    .then(function(response) {
      return response.data
    })
}

// get the status of a given batch id
function getBatchStatus(restApiUrl, batchId) {
  return axios
    .get(`${restApiUrl}/batch_statuses?id=${batchId}`)
    .then(function(response) {
      return response.data
    })
}

// submit a new transaction
// the payload is the raw HTTP body to send to the validator (via the rest api)
function submitTransaction(restApiUrl, payload) {
  // TBC
}

module.exports = {
  getState: getState,
  getBatchStatus: getBatchStatus,
  submitTransaction: submitTransaction,
}