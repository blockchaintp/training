'use strict'

/*

  library for constructing addresses for the XO transaction family

  XO tp addresses are formed using the first 6 bytes of the hash of the 
  family name (xo)

  Then the first 64 bytes of the hash of the game name

  You can use parts of the address to load a list of games

  To load the data for a single game:

    NAMESPACE_HASH(6) + GAME_NAME_HASH(64)

  To load the data for all games:

    NAMESPACE_HASH(6)
  
*/


// import the base node crypto library for creating hashes for addresses
const crypto = require('crypto')

// the base family name for the XO transaction processor
const XO_FAMILY = 'xo'

// the current version we are using
const XO_VERSION = '1.0'

// utility for creating a hash of the given string using the sha512 algorithm
function createHash(st) {
  return crypto.createHash('sha512').update(st).digest('hex').toLowerCase()
}

// the NAMESPACE_HASH is the first 6 characters of the hash of the XO_FAMILY
const XO_NAMESPACE = createHash(XO_FAMILY).substring(0, 6)

// address for a game is a combination of the XO_NAMESPACE and the first
// 64 characters of the hash of the game name
function gameAddress(name) {
  return XO_NAMESPACE + createHash(name).substring(0, 64)
}

module.exports = {
  XO_FAMILY,
  XO_VERSION,
  XO_NAMESPACE,
  gameAddress,
}
