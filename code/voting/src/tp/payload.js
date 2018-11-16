'use strict'

/*

  process the incoming payload for new transactions

  transaction payloads are arbritrary bytes as far as the validator is concerned

  it is the job of the transaction processor (i.e. this file) to decode the
  binary payload into something meaningful

  the encoding of the payload is up to you - in this case we are using binary
  encoded CSV but you can use anything that suits

  other options for encoding are:

   * binary encoded CSV
   * binary encoded JSON
   * proto buffers

  if there are any errors in processing the payload - we throw a 
  InvalidTransaction exception which is imported from the core SDK
  
*/

// import the InvalidTransaction exception so we can throw errors in case
// of a bad payload
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

// the payload is a binary encoded CSV string
function processPayload(binaryPayload) {

  // first concert the binary payload into a string
  const stringPayload = binaryPayload.toString()

  let votePayload = null

  try {
    votePayload = JSON.parse(stringPayload)
  } catch(e) {
    throw InvalidTransaction(`The JSON payload could not be processed: ${e.toString()}`)
  }

  // TODO: validate this payload depending on the action

  if(votePayload.action == 'register') {
    if(!votePayload.person_details) {
      throw InvalidTransaction(`for a register action - you must include a person_details field`)
    }
  }

  // TODO: lots more payload validation 
  return votePayload
}

module.exports = processPayload
