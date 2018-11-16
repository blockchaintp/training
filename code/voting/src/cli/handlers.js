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

/*

  the list command handler

   * call the loadGames method of the state library
   * format the output

  args:

   * url - the url of the restAPi server
   * format - the format for the output
  
*/
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
function registerUser(args) {

  const state = State(args.url)

  // load the keys from disk based on the keyDir and keyName
  const keys = keyUtils.getKeys(args.keyDir, args.keyName)

  // create a signer using our private key
  const signer = Transaction.createSigner(keys.private)

  const payload = JSON.stringify({
    action: 'register',
    person_details: {
      name: args.name
    }
  })

  //const address = Address.personAddress(args.name)
  const address = Address.personAddress(args.name)

  // create the signed transaction ready to send
  // this will return the raw binary we will send to the rest api
  const batchListBytes = Transaction.singleTransactionBytes({
    signer: signer,
    address: address,
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
