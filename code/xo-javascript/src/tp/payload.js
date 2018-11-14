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

  // now split based on comma to get the individual parts of the payload
  const payloadParts = stringPayload.split(',')

  // check the payload has the correct number of bytes
  if (payloadParts.length !== 3) throw new InvalidTransaction('Invalid payload serialization')

  // turn the array of string values into an object with key,value pairs
  const xoPayload = {
    name: payloadParts[0],
    action: payloadParts[1],
    space: payloadParts[2],
  }

  // check that a name has been provided
  if (!xoPayload.name) throw new InvalidTransaction('Name is required')

  // check that the name does not contain the | character
  if (xoPayload.name.indexOf('|') !== -1) throw new InvalidTransaction('Name cannot contain "|"')
    
  // checke that an action has been defined
  if (!xoPayload.action) throw new InvalidTransaction('Action is required')
    
  return xoPayload
}

module.exports = processPayload
