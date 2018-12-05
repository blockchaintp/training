'use strict'

function deserialize(jsonString) {

  // if there is no data then return nothing
  if(!jsonString) return null

  /*
  
    the structure of our data is:

     * PERSON - some who can vote in the system

      - name
      - publicKey

     * VOTE - a thing that can be voted

      - name
      - proposal
      - result - one of VOTING, PASSED, REJECTED, TIE
      - voting_people
       - object
          - key = person name
          - value = yes, no or null
    
  */

  const jsonValue = JSON.parse(jsonString)
  return jsonValue
}

function serialize(dataObject) {
  return JSON.stringify(dataObject)
}

// convert a base64 string into it's raw data
function fromBase64(data) {
  const buffer = new Buffer(data, 'base64')
  return buffer.toString('utf8')
}

// convert raw data into a base64 string
function toBase64(data) {
  const buffer = new Buffer(data)
  return buffer.toString('base64')
}

module.exports = {
  deserialize,
  serialize,
  fromBase64,
  toBase64,
}