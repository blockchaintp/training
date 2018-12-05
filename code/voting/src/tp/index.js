'use strict'

const { TransactionProcessor } = require('sawtooth-sdk/processor')
const VoteHandler = require('./handler')
const tpUtils = require('./utils')

const args = require('minimist')(process.argv, {
  default: {
    validator: process.env.VALIDATOR
  }
})

if(!args.validator) {
  console.error(`validator address required - either pass a --validator argument or a VALIDATOR environment variable`)
  process.exit(1)
}

const transactionProcessor = new TransactionProcessor(args.validator)
transactionProcessor.addHandler(new VoteHandler())

transactionProcessor._handleShutdown = tpUtils.handleShutdown(transactionProcessor)

transactionProcessor.start()
