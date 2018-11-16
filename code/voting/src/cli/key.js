'use strict'

const fs = require('fs')
const path = require('path')

// import the private key library
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')

// import the signing library
const {createContext, CryptoFactory} = require('sawtooth-sdk/signing')

// create a new signing context based on secp256k1 keys
const context = createContext('secp256k1')

// return a private key object from it's hex string
function privateKeyFromHex(privateKeyHex) {
  return Secp256k1PrivateKey.fromHex(privateKeyHex)
}

// create a new signing context based on the provided private key hex
const getSigner = (privateKeyHex) => {
  const privateKey = privateKeyFromHex(privateKeyHex)
  return new CryptoFactory(context).newSigner(privateKey)
}

// return an object with 'public' and 'private' fields that are the keys as hex strings
// loaded from the given directory and user
// error and exit if either key is not present
function getKeys(keyDirectory, keyName) {

  const privateKeyPath = path.join(keyDirectory, `${keyName}.priv`)
  const publicKeyPath = path.join(keyDirectory, `${keyName}.pub`)

  if(!fs.existsSync(privateKeyPath)) {
    console.error(`The private key file for user ${keyName} is not present: ${privateKeyPath}`)
    process.exit(1)
  }

  if(!fs.existsSync(publicKeyPath)) {
    console.error(`The public key file for user ${keyName} is not present: ${publicKeyPath}`)
    process.exit(1)
  }

  const privateKey = fs.readFileSync(privateKeyPath, 'utf8').replace(/\n/g, '')
  const publicKey = fs.readFileSync(publicKeyPath, 'utf8').replace(/\n/g, '')

  return {
    private: privateKey,
    public: publicKey,
  }
}

module.exports = {
  getSigner: getSigner,
  getKeys: getKeys,
  privateKeyFromHex: privateKeyFromHex,
}