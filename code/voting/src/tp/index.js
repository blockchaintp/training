'use strict'

/*

  the main entry point of the transaction processor

  this will get the validator endpoint from command line arguments or the
  environment and initiate a connection to the validator which will
  register the transaction processor to start receiving transactions
  for the XO family
  
*/

// import the base TransactionProcessor class from the SDK
// this provides a connection to the validator and will invoke our
// handler with transactions as they arrive 
const { TransactionProcessor } = require('sawtooth-sdk/processor')

// the handler is our implementation of transaction processor
// we add it to the TransactionProcessor
const VoteHandler = require('./handler')

// import the transaction processor utils library
const tpUtils = require('./utils')

// process the command line variables to get the validator endpoint
// this can be specified using either the `--validator-address` CLI argument
// or by using the VALIDATOR_ADDRESS environment variable
const args = require('minimist')(process.argv, {
  default: {
    validator: process.env.VALIDATOR
  }
})

// check that we have a validator address before continuing
// error if we don't have it
if(!args.validator) {

  // inform the user they need to provide a validator address
  console.error(`validator address required - either pass a --validator argument or a VALIDATOR environment variable`)

  // exit the process
  process.exit(1)
}

// create a new transaction processor object
// this is a core object of the SDK and looks after the network connection
// to the validator using ZeroMQ sockets
const transactionProcessor = new TransactionProcessor(args.validator)

// add our XO handler to the base transactionProcessor
// this will register the XO transaction family and the version
transactionProcessor.addHandler(new VoteHandler())

// override the _handleShutdown to give enough time to unregsiter the tp
// from the validator - useful in development so we can restart the process
transactionProcessor._handleShutdown = tpUtils.handleShutdown(transactionProcessor)

// start the transactionProcessor - this will initiate and register the
// transaction processor with the validator
transactionProcessor.start()
