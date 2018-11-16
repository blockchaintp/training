'use strict'

// import the unregister and message types from the SDK
const {
  TpUnregisterRequest,
  Message,
} = require('sawtooth-sdk/protobuf')

// the combination of moves that would represent a win for a given letter
const WINS = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7]
]

// given a board and a letter (either X or O)
// determine if that letter has won the game
function isWin(board, letter) {

  const playerWinString = [
    letter,
    letter,
    letter,
  ].join('')

  // filter each of the winning moves down to one
  // that is present on board
  const winningCombos = WINS.filter(function(winningCombo) {

    const winningComboString = [
      board[winningCombo[0] - 1],
      board[winningCombo[1] - 1],
      board[winningCombo[2] - 1],
    ].join('')

    return winningComboString == playerWinString
  })

  // if there is a winningCombo - it means the given letter has won the game
  return winningCombos.length > 0
}


// create the initial state of a game given it's name
function initialGameState(name) {
  return {
    name: name,
    board: '---------',
    state: 'P1-NEXT',
    player1: '',
    player2: ''
  }
}


// used to override the core SDK shutdown method to make sure we
// give enough time to unregister this tp from the validator
// this makes it possible to restart the tp in the case of errors
function handleShutdown(transactionProcessor) {
  return function() {
    console.log('sending unregister request')

    transactionProcessor._stream.send(
      Message.MessageType.TP_UNREGISTER_REQUEST,
      TpUnregisterRequest.encode().finish()
    )
    setTimeout(function() {
      console.log('exiting process')
      process.exit()
    }, 1000)
  }
}

module.exports = {
  isWin: isWin,
  initialGameState: initialGameState,
  handleShutdown: handleShutdown,
}