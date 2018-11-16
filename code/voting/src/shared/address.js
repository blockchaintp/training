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
const VOTE_FAMILY = 'vote'

// the current version we are using
const VOTE_VERSION = '1.0'

// utility for creating a hash of the given string using the sha512 algorithm
function createHash(st) {
  return crypto.createHash('sha512').update(st).digest('hex').toLowerCase()
}

// the VOTE_NAMESPACE is the first 6 characters of the hash of the XO_FAMILY
const VOTE_NAMESPACE = createHash(VOTE_FAMILY).substring(0, 6)

const PERSON_PATH = 'person'
const PROPOSAL_PATH = 'proposal'

const PERSON_NAMESPACE = createHash(PERSON_PATH).substring(0, 4)
const PROPOSAL_NAMESPACE = createHash(PROPOSAL_PATH).substring(0, 4)

// address for a game is a combination of the XO_NAMESPACE and the first
// 64 characters of the hash of the game name

// if person name is bob
// the path is vote.person.bob

// so combine hash('vote')[6]
// + hash('.person.bob')[64]
function personAddress(name) {
  return VOTE_NAMESPACE + PERSON_NAMESPACE + createHash(name).substring(0, 60)
}

function proposalAddress(name) {
  const personPath = `.proposal.${name}`
  return VOTE_NAMESPACE + PROPOSAL_NAMESPACE + createHash(name).substring(0, 60)
}

function allPersonAddress() {
  return VOTE_NAMESPACE + PERSON_NAMESPACE
}

function allProposalAddress() {
  return VOTE_NAMESPACE + PROPOSAL_NAMESPACE
}

module.exports = {
  VOTE_FAMILY,
  VOTE_VERSION,
  VOTE_NAMESPACE,
  personAddress,
  proposalAddress,
  allPersonAddress,
  allProposalAddress
}
