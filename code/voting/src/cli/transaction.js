'use strict'
/*

  a library to create a new signed transaction for the Voting family
  
*/

// import the various core SDK libraries
const {createHash} = require('crypto')
const protobuf = require('sawtooth-sdk/protobuf')

// import the address and key utils
const Address = require('../shared/address')
const keyUtils = require('./key')

// create a new signing context from a privatekey hex string
function createSigner(privateKeyHex) {
  return keyUtils.getSigner(privateKeyHex)
}

// creates a single transaction
function createTransaction(opts) {

  const {
    // the signer object created from the private key
    signer,

    // the name of the game we are targeting with this transaction
    inputs,
    outputs,

    // the payload of the transaction
    payload,
  } = opts

  // create the raw bytes for the transaction header
  const transactionHeaderBytes = protobuf.TransactionHeader.encode({

    // include the transactin family name and version 
    familyName: Address.VOTE_FAMILY,
    familyVersion: Address.VOTE_VERSION,

    // specific the inputs and output addresses this transaction will use
    // this is used by the validator to wait for required blocks
    // and to decide on parallel execution constaints
    inputs: inputs,
    outputs: outputs,

    // include the hex of the public key we are using to sign this transaction
    signerPublicKey: signer.getPublicKey().asHex(),
    batcherPublicKey: signer.getPublicKey().asHex(),

    // there are no dependencies for an Voting transaction
    dependencies: [],

    // create a hash of the payload
    payloadSha512: createHash('sha512').update(payload).digest('hex'),

    // create a nonce based on the current time
    nonce: new Date().getTime().toString(),
  }).finish()

  // sign the transaction header
  const signature = signer.sign(transactionHeaderBytes)

  // return the transaction using the proto buffer from the core SDK
  return protobuf.Transaction.create({

    // the bytes we created for the header above
    header: transactionHeaderBytes,

    // the signature of the header bytes we signed above
    headerSignature: signature,

    // the binary payload - Voting uses utf8 CSV strings so we are
    // creating the binary payload from a UTF8 string
    // on other transaction processors, you can used your own form
    // of encoding
    payload: Buffer.from(payload, 'utf8'),
  })
}

// create a batch given a signer and a list of transactions
function createBatch(opts) {

  const {
    // the signer object created from the private key
    signer,

    // the list of transactions to include in this batch
    transactions,
  } = opts

  // create the raw bytes for the batch header
  const batchHeaderBytes = protobuf.BatchHeader.encode({

    // include the hex of the public key we are using to sign this transaction 
    signerPublicKey: signer.getPublicKey().asHex(),

    // map the list of transactions onto a list of their headerSignatures
    transactionIds: transactions.map((txn) => txn.headerSignature),
  }).finish()

  // sign the batch header using our signer
  const signature = signer.sign(batchHeaderBytes)

  // return the batch using the proto buffer from the core SDK
  return protobuf.Batch.create({

    // the bytes we created for the header above
    header: batchHeaderBytes,

    // the signature of the header bytes we signed above
    headerSignature: signature,

    // the list of transactions we are including in the batch
    transactions: transactions
  })
}

// create a binary batch list from a list of batches
function getBatchListBytes(batches) {
  return protobuf.BatchList.encode({
    batches
  }).finish()
}

// helper function to turn a single transaction into a final
// batch list in binary form
// this is the thing we post to the rest api to submit a new transaction
function singleTransactionBytes(opts) {
  const {
    // the signer object created from the private key
    signer,

    // the name of the game we are targeting with this transaction
    inputs,
    outputs,

    // the payload of the transaction
    payload,
  } = opts

  // create the transaction
  const transaction = createTransaction({
    signer: signer,
    inputs: inputs,
    outputs: outputs,
    payload: payload,
  })

  // create the batch
  const batch = createBatch({
    signer: signer,
    transactions: [transaction]
  })

  // return the raw binary we will post to the rest api
  return getBatchListBytes([batch])
}

module.exports = {
  createSigner: createSigner,
  createTransaction: createTransaction,
  createBatch: createBatch,
  getBatchListBytes: getBatchListBytes,
  singleTransactionBytes: singleTransactionBytes,
}