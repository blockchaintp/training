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
const XOState = require('./state')

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
class XOHandler extends TransactionHandler {

  // the constructor will register the transaction processor with the validator
  // we provide it with the name of the transaction family, the version and the
  // address namespace it can manipulate
  constructor () {
    super(Address.XO_FAMILY, [Address.XO_VERSION], [Address.XO_NAMESPACE])
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
    const state = new XOState(context)

    // extract the header from the incoming payload
    const header = transactionProcessRequest.header

    // the player is represented by the public key that was used to sign the
    // transaction - extract this from the header
    const player = header.signerPublicKey

    // call the createGame function because the action type is 'create'
    if (payload.action === 'create') {
      return this.createGame(state, payload, player)
    }
    // call the deleteGame function because the action type is 'delete'
    else if(payload.action === 'delete') {
      return this.deleteGame(state, payload, player)
    }
    // call the playGame function because the action type is 'take'
    else if(payload.action === 'take') {
      return this.playGame(state, payload, player)
    }
    // handle the case where the action type is not known
    else {
      throw new InvalidTransaction(
        `Action must be create, delete, or take not ${payload.action}`
      )
    }
  }

  // handle the creation of a new game
  // load the game to check it doesn't exist
  // generate the initial game state
  // write the initial game state to the validator
  createGame (state, payload, player) {

    // first - load the game so we can check it doesn't already exist
    return state.getGame(payload.name)
      .then((game) => {

        // if the game already exists - we cannot create it
        if (game) {
          throw new InvalidTransaction('Invalid Action: Game already exists.')
        }

        // the initial state of a game
        const initialGameState = tpUtils.initialGameState(payload.name)

        // log the creation of the game
        console.log(`Player ${sharedUtils.shortKey(player)} created game ${payload.name}`)

        // call the state library to create a new game entry
        return state.setGame(payload.name, initialGameState)
      })
  }

  // handle the deletion of an existing game
  // load the game to check it exists
  // delete it from the validator
  deleteGame (state, payload, player) {

    // first - load the game so we can check it does actually exist
    return state.getGame(payload.name)
      .then((game) => {

        // if the game does not exist - we cannot delete it
        if (!game) {
          throw new InvalidTransaction(
            `No game exists with name ${payload.name}: unable to delete`)
        }

        // call the state library to delete the game from the state tree
        return state.deleteGame(payload.name)
      })
  }

  // handle the take action i.e. play a game
  playGame (state, payload, player) {

    // first load the game so we know it's current state
    return state.getGame(payload.name)
      .then((game) => {

        // if the game does not exist - we cannot play it
        if (!game) {
          throw new InvalidTransaction(
            `No game exists with name ${payload.name}: unable to play`)
        }

        let space = null

        // check the given space in the payload is an integer
        try {
          space = parseInt(payload.space)
        } catch (err) {
          throw new InvalidTransaction('Space could not be converted as an integer.')
        }
        if(isNaN(space)) {
          throw new InvalidTransaction('Space could not be converted as an integer.')
        }

        // check the validity of the given space
        if (space < 1 || space > 9) {
          throw new InvalidTransaction('Invalid space ' + space)
        }

        // check that the game has not already ended
        if (['P1-WIN', 'P2-WIN', 'TIE'].includes(game.state)) {
          throw new InvalidTransaction('Invalid Action: Game has ended.')
        }

        // here - we assign the player properties of the game
        // only do this if a player has not already been assigned
        // this means anyone can play as either player until someone already
        // has assigned their key to that player
        if (game.player1 === '') {
          game.player1 = player
        } else if (game.player2 === '') {
          game.player2 = player
        }

        // get an array of characters representing each space on the board
        const boardList = game.board.split('')

        // check that the space we are wanting to take is not already taken
        if (boardList[space - 1] !== '-') {
          throw new InvalidTransaction('Invalid Action: Space already taken.')
        }

        // check what player is next (P1 = 'X', P2 = 'O')
        // assign the piece to the board
        // check that the transaction signing key is that player
        if (game.state === 'P1-NEXT' && player === game.player1) {
          boardList[space - 1] = 'X'
          game.state = 'P2-NEXT'
        } 
        else if (game.state === 'P2-NEXT' && player === game.player2) {
          boardList[space - 1] = 'O'
          game.state = 'P1-NEXT'
        } else {
          throw new InvalidTransaction(
            `Not this player's turn: ${sharedUtils.shortKey(player)}`
          )
        }

        // recreate the board string from the array we just created
        game.board = boardList.join('')

        // check to see if either player has won the game
        if (tpUtils.isWin(boardList, 'X')) {
          game.state = 'P1-WIN'
        } 
        else if (tpUtils.isWin(boardList, 'O')) {
          game.state = 'P2-WIN'
        }
        // check to see if there are any empty spaces left on the board
        // if no - then the game is a TIE
        else if (game.board.search('-') === -1) {
          game.state = 'TIE'
        }

        // log the move
        console.log(`Player ${sharedUtils.shortKey(player)} takes space: ${space}`)
        console.log(sharedUtils.gameToString(game))
        
        // set the state with the new game data
        return state.setGame(payload.name, game)
      })
  }
}

module.exports = XOHandler
