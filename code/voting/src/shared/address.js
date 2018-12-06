'use strict'

const crypto = require('crypto')

const VOTE_FAMILY = 'vote'
const VOTE_VERSION = '1.0'

function createHash(st) {
  return crypto.createHash('sha512').update(st).digest('hex').toLowerCase()
}

const VOTE_NAMESPACE = createHash(VOTE_FAMILY).substring(0, 6)

const PERSON_PATH = 'person'
const PROPOSAL_PATH = 'proposal'

const PERSON_NAMESPACE = createHash(PERSON_PATH).substring(0, 4)
const PROPOSAL_NAMESPACE = createHash(PROPOSAL_PATH).substring(0, 4)

function personAddress(publicKey) {
  return VOTE_NAMESPACE + PERSON_NAMESPACE + createHash(publicKey).substring(0, 60)
}

function proposalAddress(name) {
  return VOTE_NAMESPACE + PROPOSAL_NAMESPACE + createHash(name).substring(0, 60)
}

function allPersonAddress() {
  return VOTE_NAMESPACE + PERSON_NAMESPACE
}

function allProposalAddress() {
  return VOTE_NAMESPACE + PROPOSAL_NAMESPACE
}

module.exports = {
  createHash,
  VOTE_FAMILY,
  VOTE_VERSION,
  VOTE_NAMESPACE,
  PERSON_NAMESPACE,
  PROPOSAL_NAMESPACE,
  personAddress,
  proposalAddress,
  allPersonAddress,
  allProposalAddress
}
