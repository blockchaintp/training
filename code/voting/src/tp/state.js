'use strict'

/*

  library for managing the state of a transaction processor

  Create, Retreive, Update, Delete (i.e. CRUD) actions are the main
  concern of this library

  we are given a 'context' which is a core SDK object that has the
  following key methods:

   * getState - read state from an address prefix
   * setState - set state to an address
   * deleteState - delete state from an address

  Each of these methods will mutate the state associated with the given
  address

  They all return Promises which is a way in Javascript of handling the 
  asynchronous nature of the underlying api 
  
*/

// when we communicate with the validator set a timeout
// value which is the maximum amount of time a request is allowed to take
const TIMEOUT = 1000

// import the address library which knows how to construct Sawtooth
// addresses based on the transaction family name and the game name
const Address = require('../shared/address')

// import the encoding library which knows how to encode and decode the
// state of a game into/from a single string
const Encoding = require('../shared/encoding')

const { InvalidTransaction, InternalError } = require('sawtooth-sdk/processor/exceptions')

// the main library constructor which accepts the SDK context object
function VotingState(context) {

  function listPeople() {
    const address = Address.allPersonAddress()

    return context.getState([address], TIMEOUT)
      .then(function(addressValues) {

        // YAY - we have an answer from the validator
        // addressData = {'ADDRESS': 'DATA'}

        const peopleArray = Object
          .keys(addressValues)
          .map(personAddress => {
            const binaryPersonData = addressValues[personAddress] 
            const stringPersonData = binaryPersonData.toString()
            return Encoding.deserialize(stringPersonData)
          })

        return peopleArray
      })
  }

  function getPerson(name) {
    const address = Address.personAddress(name)

    return context.getState([address], TIMEOUT)
      .then(function(addressValues) {

        // YAY - we have an answer from the validator

        // addressData = {'ADDRESS': 'DATA'}
        // addressValues is an object of found state
        // the key is the actual address of the data
        // the value is a binary value of the actual state

        const binaryPersonData = addressValues[address]

        // convert the binary value into a string
        const stringPersonData = binaryPersonData.toString()

        // return a game object that is deserialized from the given string
        return Encoding.deserialize(stringPersonData)
      })
  }

  function setPerson(name, personObject) {
    const address = Address.personAddress(name)

    const personJSONString = Encoding.serialize(personObject)

    // turn the CSV string into binary data
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

        // YAY - we have an answer from the validator
        // addressData = {'ADDRESS': 'DATA'}

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

        // YAY - we have an answer from the validator

        // addressData = {'ADDRESS': 'DATA'}
        // addressValues is an object of found state
        // the key is the actual address of the data
        // the value is a binary value of the actual state

        const binaryProposalData = addressValues[address]

        // convert the binary value into a string
        const stringProposalData = binaryProposalData.toString()

        // return a game object that is deserialized from the given string
        return Encoding.deserialize(stringProposalData)
      })
  }

  function setProposal(proposalObject) {
    const address = Address.proposalAddress(proposalObject.name)

    const proposalJSONString = Encoding.serialize(proposalObject)

    // turn the CSV string into binary data
    const proposalBinaryData = Buffer.from(proposalJSONString)

    const stateEntries = {
      [address]: proposalBinaryData
    }

    return context.setState(stateEntries, TIMEOUT)
  }

  // return an object with each of the state methods
  return {
    listPeople: listPeople,
    getPerson: getPerson,
    setPerson: setPerson,
    listProposals: listProposals,
    getProposal: getProposal,
    setProposal: setProposal,
  }
}

module.exports = VotingState