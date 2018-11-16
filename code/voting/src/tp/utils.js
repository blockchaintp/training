'use strict'

// import the unregister and message types from the SDK
const {
  TpUnregisterRequest,
  Message,
} = require('sawtooth-sdk/protobuf')

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
  handleShutdown: handleShutdown,
}