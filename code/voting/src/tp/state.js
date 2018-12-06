'use strict'

const TIMEOUT = 1000
const Address = require('../shared/address')
const Encoding = require('../shared/encoding')

const { InvalidTransaction, InternalError } = require('sawtooth-sdk/processor/exceptions')

function VotingState(context) {

  function getPerson(publicKey) {
    const address = Address.personAddress(publicKey)

    return context.getState([address], TIMEOUT)
      .then(function(addressValues) {

        const binaryPersonData = addressValues[address]

        if(!binaryPersonData) {
          return null
        }
        const stringPersonData = binaryPersonData.toString()

        return Encoding.deserialize(stringPersonData)
      })
  }

  function setPerson(publicKey, personObject) {
    const address = Address.personAddress(publicKey)

    const personJSONString = Encoding.serialize(personObject)
    const personBinaryData = Buffer.from(personJSONString)

    const stateEntries = {
      [address]: personBinaryData
    }

    console.log(`writing new state entries`)
    console.dir(Object.keys(stateEntries))

    return context.setState(stateEntries, TIMEOUT)
  }


  function listProposals() {
    const address = Address.allProposalAddress()

    return context.getState([address], TIMEOUT)
      .then(function(addressValues) {

        const proposalArray = Object
          .keys(addressValues)
          .map(proposalAddress => {
            const binaryProposalData = addressValues[proposalAddress] 
            const stringProposalData = binaryProposalData.toString()
            return Encoding.deserialize(stringProposalData)
          })

        return proposalArray
      })
  }

  function getProposal(name) {
    const address = Address.proposalAddress(name)

    return context.getState([address], TIMEOUT)
      .then(function(addressValues) {
        const binaryProposalData = addressValues[address]
        const stringProposalData = binaryProposalData.toString()

        return Encoding.deserialize(stringProposalData)
      })
  }

  function setProposal(proposalObject) {
    const address = Address.proposalAddress(proposalObject.name)

    const proposalJSONString = Encoding.serialize(proposalObject)
    const proposalBinaryData = Buffer.from(proposalJSONString)

    const stateEntries = {
      [address]: proposalBinaryData
    }

    return context.setState(stateEntries, TIMEOUT)
  }

  // return an object with each of the state methods
  return {
    getPerson: getPerson,
    setPerson: setPerson,
    listProposals: listProposals,
    getProposal: getProposal,
    setProposal: setProposal,
  }
}

module.exports = VotingState