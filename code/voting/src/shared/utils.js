'use strict'

function shortKey(key) {
  return key.toString().substring(0, 6)
}

module.exports = {
  shortKey: shortKey,
}