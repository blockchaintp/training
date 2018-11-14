'use strict'

/*

  utility library for the XO transaction family

  these function might be used by both the CLI and the transaction processor
  
*/

// return a short version of the given key
function shortKey(key) {
  return key.toString().substring(0, 6)
}

// a function that prints a nice string representation of the board
function gameToString(game){

  // replace the board '-' character with spaces
  const board = game.board.replace(/-/g, ' ')

  // create an array of board state
  const boardSpaces = board.split('')

  // make an array of text lines for the output
  const parts = [
    `GAME: ${game.name}`
    `PLAYER 1: ${shortKey(game.player1)}`
    `PLAYER 2: ${shortKey(game.player2)}`
    `STATE: ${game.state}`
    ``
    `${boardSpaces[0]} | ${boardSpaces[1]} | ${boardSpaces[2]}`
    `---|---|---`
    `${boardSpaces[3]} | ${boardSpaces[4]} | ${boardSpaces[5]}`
    `---|---|---`
    `${boardSpaces[6]} | ${boardSpaces[7]} | ${boardSpaces[8]}`
  ]

  return parts.join("\n")
}

module.exports = {
  shortKey: shortKey,
  gameToString: gameToString,
}