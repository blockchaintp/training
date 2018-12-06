'use strict'

// import the state library
const State = require('./state')

// import the text formatting library
const Formatters = require('./formatters')

// import the CLI utils library
const keyUtils = require('./key')

// import the Transaction library
const Transaction = require('./transaction')

const Address = require('../shared/address')

function listPeople(args) {
  const state = State(args.url)

  state
    .loadPeople()
    .then(function(peopleList) {

      if(args.format == 'json') {
        console.log(Formatters.asJson(peopleList))
      }
      else {
        console.log(Formatters.listPeopleTable(peopleList))
      }
    })
}

function registerUser(args) {

  const state = State(args.url)
  const keys = keyUtils.getKeys(args.keyDir, args.keyName)
  const signer = Transaction.createSigner(keys.private)

  const payload = JSON.stringify({
    action: 'register',
    person_details: {
      name: args.name
    }
  })

  const inputs = Address.personAddress(keys.public)
  const outputs = Address.personAddress(keys.public)

  // create the signed transaction ready to send
  // this will return the raw binary we will send to the rest api
  const batchListBytes = Transaction.singleTransactionBytes({
    signer: signer,
    inputs: [inputs],
    outputs: [outputs],
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
  listPeople: listPeople,
  registerUser: registerUser,
}
