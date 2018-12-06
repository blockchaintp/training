'use strict'

const Address = require('./shared/address')


const allDataAddress = Address.VOTE_NAMESPACE
const allPersonAddress = Address.allPersonAddress()
const allProposalAddress = Address.allProposalAddress()

const bobAddress = Address.personAddress('bob')
const brexitAddress = Address.proposalAddress('brexit')

console.dir({
  allDataAddress,
  allPersonAddress,
  allProposalAddress,
  bobAddress,
  brexitAddress,
})