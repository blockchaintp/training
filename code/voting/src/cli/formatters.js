'use strict'

// import a library for making CLI tables
const Table = require('table')

// import the shared utils for making short keys
const sharedUtils = require('../shared/utils')

/*

  format various data structures into text output

  if we are using JSON output - this is not needed as we print raw data
  
*/

// output the array of games as a CLI table
function listPeopleTable(people) {
  const titles = ['NAME', 'KEY']
  const peopleData = people.map(function(person){
    return [
      person.name,
      sharedUtils.shortKey(person.publicKey),
    ]
  })

  const data = [titles].concat(peopleData)
  return Table.table(data, {
    border: Table.getBorderCharacters('norc')
  })
}

// print the raw JSON to stdout
function asJson(data) {
  return JSON.stringify(data, null, 4)
}

// print a submitted transaction status
function submittedBatch(data) {
  const parts = [
    `batch id:             ${data.id}`,
    `status:               ${data.status}`,
  ]

  if(data.invalid_transactions.length > 0) {
    parts.push(`invalid transactions: ${data.invalid_transactions.length}`)

    data.invalid_transactions.forEach(function(invalidTransaction) {
      parts.push('')
      parts.push(`transaction id:       ${invalidTransaction.id}`)
      parts.push(`message:              ${invalidTransaction.message}`)
    })
  }

  return parts.join("\n")
}

module.exports = {
  listPeopleTable: listPeopleTable,
  asJson: asJson,
  submittedBatch: submittedBatch,
}
