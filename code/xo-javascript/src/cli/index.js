#!/usr/bin/env node
'use strict'

/*

  the main entry point of the client

  we process the command line arguments and call the relevent command

  the rest-api URL is checked 
  
*/

const yargs = require('yargs')

yargs
  .command({
    command: 'list',
    aliases: ['$0'],
    desc: 'List the current XO games',
    handler: function(argv) {
      console.log('-------------------------------------------');
      console.dir(argv)
    }
  })
  .command({
    command: 'create <name>',
    desc: 'Create a new XO game',
    handler: function(argv) {
      console.log('-------------------------------------------');
      console.dir(argv)
    }
  })
  .option('url', {
    describe: 'the url to connect to the rest api',
    default: process.env.URL,
  })
  .option('output', {
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
