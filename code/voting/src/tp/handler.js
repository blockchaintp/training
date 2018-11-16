'use strict'

/*

  the actual handler for transactions in the XO transaction family

  this will accept transactions and process the payload

  depending on the contents of the payload and current game state
  perform some kind of state transition

  think of the handler as the main logic behind the tp
  
*/


// load the base handler class from the core SDK
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')

// load the InvalidTransaction exception from the core SDK
// this is what we will throw in the case of any logical errors with the  
const { InvalidTransaction, InternalError } = require('sawtooth-sdk/processor/exceptions')

// load the address library so we know the XO_FAMILY, XO_NAMESPACE and XO_VERSION
const Address = require('../shared/address')

// load the payload library to process the incoming transaction payload
const processPayload = require('./payload')

// load the state library that let's us perform state mutations back to the validator
const VoteState = require('./state')

// import the transaction processor utils library
const tpUtils = require('./utils')

// import the shared utils library
const sharedUtils = require('../shared/utils')

/*

  the main XOHandler class that we will add to the transactionProcessor

  this is a subclass of the core SDK TransactionHandler class

  as such - it must call the super constructor with:

   * XO_FAMILY
   * XO_VERSION
   * XO_NAMESPACE

  it must also implement an 'apply' method which will handle new transactions
  
*/
class VoteHandler extends TransactionHandler {

  // the constructor will register the transaction processor with the validator
  // we provide it with the name of the transaction family, the version and the
  // address namespace it can manipulate
  constructor () {
    super(Address.VOTE_FAMILY, [Address.VOTE_VERSION], [Address.VOTE_NAMESPACE])
  }

  // the apply method handles incoming transactions for this family
  //
  // the 'transactionProcessRequest' object contains:
  //  * payload - the binary data sent by the client for this transaction
  //  * header - the header of the transaction which notably contains the
  //             'signerPublicKey' property which is the key used to sign
  //             the transaction on the client
  //
  // the 'context' object gives us an api to read and write state back to
  // the validator and notably contains these methods:
  //  * getState - read state from an address prefix
  //  * setState - set state to an address
  //  * deleteState - delete state from an address
  //
  // if the apply method throws an InvalidTransaction exception
  // this will be handled and the message will be printed to the batch status
  apply (transactionProcessRequest, context) {

    // first, process the binary payload into an object with these keys:
    //  * name - the name of the game this transaction is for
    //  * action - the action we are performing on the game (create,take,delete)
    //  * space - the space the transaction is for (if the action is take)
    const payload = processPayload(transactionProcessRequest.payload)

    // create a new state object that will enable us to read and write state
    // for the game back to the validator
    // we pass the context into the state module so it can communicate with
    // the validator state tree
    const state = new VoteState(context)

    // extract the header from the incoming payload
    const header = transactionProcessRequest.header

    // the player is represented by the public key that was used to sign the
    // transaction - extract this from the header
    const userPublicKey = header.signerPublicKey

    // call the createGame function because the action type is 'create'
    /*if (payload.action === 'propose_vote') {
      return this.proposeVote(state, payload, userPublicKey)
    }
    // call the deleteGame function because the action type is 'delete'
    else */
    if(payload.action === 'register') {
      return this.registerUser(state, payload, userPublicKey)
    }
    /*// call the playGame function because the action type is 'take'
    else if(payload.action === 'vote') {
      return this.vote(state, payload, userPublicKey)
    }*/
    // handle the case where the action type is not known
    else {
      throw new InvalidTransaction(
        `Action must be propose_vote, register, or vote not ${payload.action}`
      )
    }
  }

  // handle the creation of a new game
  // load the game to check it doesn't exist
  // generate the initial game state
  // write the initial game state to the validator
  registerUser (state, payload, userPublicKey) {

    if(!payload.person_details) {
      throw new InvalidTransaction('Invalid Action: payload must have a person_details field')
    }

    if(!payload.person_details.name) {
      throw new InvalidTransaction('Invalid Action: payload must have a person_details.name field')
    }

    const newPerson = Object.assign({}, payload.person_details)
    newPerson.publicKey = userPublicKey

    console.log(`creating new user ${newPerson.name}`)

    return state.setPerson(newPerson.name, newPerson)
  }

}

module.exports = VoteHandler
