'use strict'

/*

  utilities for managing the encoding of the game state
  
*/

// a function that knows how to process an encoded data into game objects
// splitting by , (because the XO transaction family uses CSV encoding)
function deserialize(csvString) {

  // if there is no data then return nothing
  if(!csvString) return null

  // there should only be a single game at the given address
  // the XO transaction family specification states that we should
  // be joining multiple values using the | character
  // this is a defensive move to account for accidental address collisions

  // always use the first string found - ignore the split by | part of the
  // xo tp family specification for the sake of leaning
  const gameString = csvString.split('|')[0]

  // split the gameString into an array of parts
  const csvParts = gameString.split(',')

  // return an object turning the positional values into named keyd
  return {

    // the name of the game
    name: csvParts[0],

    // the current representation of the board
    board: csvParts[1],

    // the current state of the game
    state: csvParts[2],

    // the signing key used for player1
    player1: csvParts[3],

    // the signing key used for player2
    player2: csvParts[4],
  }
}

// a function that knows how to encode a of game object into the data
// string we can save back to the validator state tree
// this involves CSV encoding the game object
function serialize(gameObject) {

  // create an array with the keys in the correct order
  const gameParts = [
    gameObject.name,
    gameObject.board,
    gameObject.state,
    gameObject.player1,
    gameObject.player2,
  ]

  // join the gameParts using a comma and return that string
  return gameParts.join(',')
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