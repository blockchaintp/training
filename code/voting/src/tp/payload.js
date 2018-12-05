'use strict'

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

function processPayload(binaryPayload) {

  const stringPayload = binaryPayload.toString()

  let votePayload = null

  try {
    votePayload = JSON.parse(stringPayload)
  } catch(e) {
    throw InvalidTransaction(`The JSON payload could not be processed: ${e.toString()}`)
  }

  if(votePayload.action == 'register') {
    if(!votePayload.person_details) {
      throw InvalidTransaction(`for a register action - you must include a person_details field`)
    }
  }

  return votePayload
}

module.exports = processPayload
