'use strict'

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')

const { InvalidTransaction, InternalError } = require('sawtooth-sdk/processor/exceptions')

const Address = require('../shared/address')
const processPayload = require('./payload')
const VoteState = require('./state')
const tpUtils = require('./utils')
const sharedUtils = require('../shared/utils')

class VoteHandler extends TransactionHandler {

  constructor () {
    super(Address.VOTE_FAMILY, [Address.VOTE_VERSION], [Address.VOTE_NAMESPACE])
  }

  apply (transactionProcessRequest, context) {

    const payload = processPayload(transactionProcessRequest.payload)
    const state = new VoteState(context)
    const header = transactionProcessRequest.header
    const userPublicKey = header.signerPublicKey

    if(payload.action === 'register') {
      return this.registerUser(state, payload, userPublicKey)
    }
    else {
      throw new InvalidTransaction(
        `Action must be propose_vote, register, or vote not ${payload.action}`
      )
    }
  }

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
