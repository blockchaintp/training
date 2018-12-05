'use strict'

const {
  TpUnregisterRequest,
  Message,
} = require('sawtooth-sdk/protobuf')

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