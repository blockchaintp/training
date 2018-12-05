#!/usr/bin/env node
'use strict'

const yargs = require('yargs')

const handlers = require('./handlers')

yargs
  .command({
    command: 'list-people',
    desc: 'List the current users',
    handler: handlers.listPeople,
  })
  .command({
    command: 'register <name>',
    desc: 'Register yourself',
    handler: handlers.registerUser,
  })
  .option('url', {
    describe: 'the url to connect to the rest api',
    default: process.env.URL,
  })
  .option('format', {
    describe: 'the format of the output (text, json)',
    default: 'text',
  })
  .option('key-dir', {
    describe: 'the directory to read the keys from',
    default: '/root/.sawtooth/keys',
  })
  .option('key-name', {
    describe: 'the name of the keys to use for submitting new transactions',
    default: 'root',
  })
  .demandCommand()
  .demandOption(['url'], 'Please provide a --url option (or URL env variable) to connect to the rest api')
  .help()
  .argv
