'use strict'

/*

  utility library for the XO transaction family

  these function might be used by both the CLI and the transaction processor
  
*/

// return a short version of the given key
function shortKey(key) {
  return key.toString().substring(0, 6)
}

module.exports = {
  shortKey: shortKey,
}